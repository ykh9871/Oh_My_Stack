from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BertModel, BertTokenizer
import numpy as np
from keybert import KeyBERT
import torch
import re
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer
from kobert_transformers import get_tokenizer
from collections import Counter
from ITglossary import ITGlossary, ITGlossaryUpdater
import pymysql
import pandas as pd
from kiwipiepy import Kiwi
import urllib.request
from soyspacing.countbase import RuleDict, CountSpace
import json
from decimal import Decimal
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ohmystack.co"],  # 클라이언트의 도메인 주소를 여기에 추가
    allow_methods=["POST"],  # 요청 허용 메서드
    allow_headers=["*"],  # 요청 허용 헤더
)

# 데이터베이스 접속 설정
conn = pymysql.connect(host="host", user='user', password='password', db='db')

@app.on_event("startup")
def load_data():
    # 글로벌 변수를 선언
    global df
    global glossary
    global kw_model

    # DB에서 cosine 데이터를 불러옴
    query = "SELECT * FROM production.cosine"
    with conn.cursor() as cursor:
        df = pd.read_sql_query(query, conn)

    # IT 용어사전을 생성하고 업데이트
    glossary = ITGlossary()
    updater = ITGlossaryUpdater(glossary)
    updater.update_glossary()
    glossary.print_glossary()

    # KeyBERT 모델 로드
    model = BertModel.from_pretrained('skt/kobert-base-v1')
    kw_model = KeyBERT(model)

@app.on_event("shutdown")
def close_connection():
    # 데이터베이스 연결 종료
    conn.close()

# 요청 및 응답 모델 정의
class JobRecommendationRequest(BaseModel):
    self_intr: str

class JobRecommendationResponse(BaseModel):
    job_recommendations: list

# 텍스트 정제 함수
def clean_text(input_text):
    if not isinstance(input_text, str):
        return input_text
    input_text = input_text.lower()
    cleaned_text = re.sub(r'[^\w\s]', '', input_text)  # 특수문자 제거
    cleaned_text = re.sub(r'\([^)]*\)', '', cleaned_text)  # 괄호 안 내용 제거
    cleaned_text = re.sub(r'\r', '', cleaned_text)  # \r 제거
    cleaned_text = cleaned_text.replace('\n', '')  # newline 문자 제거
    cleaned_text = re.sub(r'<[^>]+>', '', cleaned_text)  # HTML 태그 제거
    cleaned_text = re.sub(r'www~?.(\w+.)+\w+', '', cleaned_text)  # "www" or "www~" 제거
    cleaned_text = re.sub(r'http~?', '', cleaned_text)  # "http~" 제거
    return cleaned_text

# 영어 제거 함수
def remove_english(text):
    pattern = re.compile(r'[a-zA-Z]+')
    text_without_english = re.sub(pattern, '', text)
    return text_without_english

# IT 용어 번역 함수
def translate_IT(input_text, it_glossary):
    input_text = str(input_text)
    words = re.findall(r'\b[a-zA-Z]+\b', input_text)
    for word in words:
        try:
            input_text = input_text.replace(word, it_glossary[word])
        except:
            pass
        input_text = input_text.replace('[', '')
        input_text = input_text.replace(']', '')
    return input_text

# 임베딩 생성 함수
def get_embedding(kw_model, keywords, self_intr):
    tokenizer = BertTokenizer.from_pretrained('monologg/kobert')
    embeddings = []  # 임베딩 리스트
    weights = []  # 가중치 리스트
    for keyword in keywords:
        if len(keyword) > 1:  # 키워드의 길이가 1보다 큰지 확인
            weights.append(keyword[1])  # 가중치를 리스트에서 가져옴
            with torch.no_grad():
                model = BertModel.from_pretrained('monologg/kobert')
                input_ids = tokenizer.encode(keyword[0], add_special_tokens=True)
                input_ids = torch.tensor(input_ids).unsqueeze(0)
                last_hidden_states = model(input_ids)[0]
                embedding = last_hidden_states[0].mean(dim=0).numpy()
                embeddings.append(embedding)
    if not weights or all(weight == 0 for weight in weights):
        print("가중치 Null값이 발생하였습니다.")
        return None
    return np.average(embeddings, axis=0, weights=weights)

# Numpy 객체를 JSON으로 변환하는 클래스
class NumpyJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, (np.float16, np.float32, np.float64)):
            if np.isnan(obj) or np.isinf(obj):
                return str(obj)
            return float(obj)
        if isinstance(obj, (np.int8, np.int16, np.int32, np.int64, np.uint8, np.uint16, np.uint32, np.uint64)):
            return int(obj)
        if isinstance(obj, Decimal):
            return float(obj)
        return super().default(obj)

@app.post("/job_recommendation", response_model=JobRecommendationResponse)
def job_recommendation(request: JobRecommendationRequest):
    self_intr = request.self_intr
    self_intr = translate_IT(clean_text(self_intr), glossary)  # 텍스트 정제 후 IT 용어 번역
    self_intr = remove_english(self_intr)  # 영어 제거
    self_intr = clean_text(self_intr)  # 텍스트 다시 정제

    keywords = kw_model.extract_keywords(self_intr, keyphrase_ngram_range=(1, 1), stop_words=None, top_n=10)  # 키워드 추출
    embedding = get_embedding(kw_model, keywords, self_intr)  # 임베딩 생성

    embedding2 = []
    for s in df["embedding"]:
        if s is None:
            embedding2.append(np.zeros((768,), dtype=float).tolist())
            continue

        s = s.replace('\n', '').replace('[', '').replace(']', '')
        s = re.split(r'\s+', s.strip())

        if len(s) == 0:
            embedding2.append(np.zeros((768,), dtype=float).tolist())
            continue

        arr = np.array(s, dtype=float)
        arr[np.isnan(arr)] = 0  # NaN 값을 0으로 대체
        arr[np.isinf(arr)] = 0  # Infinity 값을 0으로 대체
        arr = arr.reshape((768,))

        embedding2.append(arr.tolist())

    # 코사인 유사도 계산
    cos_sim = [cosine_similarity([embedding], [emb])[0][0] for emb in embedding2]
    cos_sim = np.array(cos_sim)
    cos_sim[np.isnan(cos_sim)] = 0  # NaN 값을 0으로 대체

    top_indices = np.argpartition(cos_sim, -10)[-10:]  # 가장 유사한 상위 10개 직무 추출
    job_recommendations = df.iloc[top_indices].to_dict(orient='records')  # 추천 직무를 dict 형태로 변환

    # JSON 응답 생성
    response_content = json.dumps({"job_recommendations": job_recommendations}, cls=NumpyJSONEncoder)
    return JSONResponse(content=response_content, media_type="application/json")
