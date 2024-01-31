from airflow import DAG
from airflow.operators.python import PythonOperator
from airflow.models import Variable
from airflow.providers.amazon.aws.hooks.s3 import S3Hook
from airflow.operators.trigger_dagrun import TriggerDagRunOperator
from datetime import datetime
import selenium
from selenium import webdriver
from selenium.common import NoSuchElementException
from selenium.webdriver.common.by import By
import time
import logging
from emoji import core
from datetime import datetime
import pandas as pd





dag = DAG(
    dag_id = 'oms_scraper',
    start_date = datetime(2023,6,12),
    schedule = '0 */3 * * *',
    max_active_runs = 1,
    catchup = False,
    default_args = {}
)



def get_S3_connection():
    return S3Hook('aws_default')


def get_page_with_selenium(url):
    options = webdriver.ChromeOptions()
    options.add_argument('headless')
    options.add_argument('window-size=1920x1080')
    options.add_argument(
        "user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36")
    driver = webdriver.Chrome(options=options)
    driver.maximize_window()
    driver.get(url)
    driver.implicitly_wait(1)
    # category_count = 2  # 초기 카테고리 번호를 2로 설정 1번은 전체이기 때문에
    return driver






def get_post_info_jumpit(**context):
    schema = context["params"]["schema"]
    table1 = context["params"]["table1"]
    table2 = context["params"]["table2"]
    url = context["params"]["url"]
    driver = get_page_with_selenium(url)
    cur = get_S3_connection()

    def get_company_name():
        company = driver.find_element(By.XPATH, '//*[@id="root"]/main/div/div[2]/div/section[1]/div/a').text
        return company

    def get_title():
        text = driver.find_element(By.XPATH, '/html/body/div[1]/main/div/div[2]/div/section[1]/h1').text
        text = core.replace_emoji(text, "")
        text = text.replace("'", "")
        return text

    def get_stack():
        text = driver.find_element(By.XPATH, '//*[@id="root"]/main/div/div[2]/div/section[2]/dl[1]/dd/pre').text.replace('\n', ',')
        return text

    def get_main_business():
        text = driver.find_element(By.XPATH, '/html/body/div[1]/main/div/div[2]/div/section[2]/dl[2]/dd/pre').text
        text = core.replace_emoji(text, "")
        return text

    def get_qualification():
        qualification = driver.find_element(By.XPATH, '//*[@id="root"]/main/div/div[2]/div/section[2]/dl[3]/dd/pre').text
        text = core.replace_emoji(qualification, "")
        return qualification

    def get_preferences():
        preferences = driver.find_element(By.XPATH, '/html/body/div[1]/main/div/div[2]/div/section[2]/dl[4]/dd/pre').text
        text = core.replace_emoji(preferences, "")
        return preferences

    def get_career():
        career = driver.find_element(By.XPATH, '//*[@id="root"]/main/div/div[2]/div/section[3]/dl[1]/dd').text
        return career

    def get_address():
        try:
            address = driver.find_element(By.XPATH, '/html/body/div[1]/main/div/div[2]/div/section[3]/dl[4]/dd/ul/li').text.split('\n')[0]
        except:
            try:
                address = driver.find_element(By.XPATH, '/html/body/div[1]/main/div/div[2]/div/section[3]/dl[3]/dd/ul/li').text.split('\n')[0]
            except:
                print(f"\n\n\n\n\n\n *********** Can't find address *********** \n\n\n\n\n\n {e}")
        return address


    df = pd.DataFrame(columns=['id', 'company', 'position', 'title', 'stack', 'main_business', 'qualification', 'preferences', 'career', 'address', 'site', 'date'])
    date = datetime.today().strftime("%Y-%m-%d %H:%M:%S")
    # 테스트용으로 마지막으로 넘어감
    category_count = 2
    while category_count <= 22:
        category_xpath = f'/html/body/div[1]/main/div/section/section/div[1]/button[{category_count}]'
        position = driver.find_element(By.XPATH, category_xpath).text
        driver.find_element(By.XPATH, category_xpath).click()
        time.sleep(0.2)
        prim_num = 0
        count = 1
        while True:
            try:
                post_xpath = f'/html/body/div[1]/main/div/div[1]/section/div[{count}]/a'
                driver.find_element(By.XPATH, post_xpath).click()
                company = get_company_name()
                title = get_title()
                stack = get_stack()
                main_business = get_main_business()
                qualification = get_qualification()
                preferences = get_preferences()
                career = get_career()
                address = get_address()
                site = driver.current_url
                print((f"\n{company, position, count, category_count}\n"))
                df.loc[len(df)] = [prim_num, company, position, title, stack, main_business, qualification, preferences, career, address, site, date]
                time.sleep(0.2)
            except Exception as e:
                print(f"\n\n\n\n\n\n *********** error *********** \n\n\n\n\n\n {e}")
                break
            finally:
                driver.back()
                time.sleep(0.2)
                count += 1
                prim_num += 1
                if count % 16 == 0:
                    driver.execute_script("window.scrollTo(0, 200)")
                post_xpath2 = f'/html/body/div[1]/main/div/div[1]/section/div[{count}]/a'
                try :
                    element = driver.find_element(By.XPATH, post_xpath2)
                    # print(element)
                except:
                    print(f"\n\n\n\n\n\n *********** selected category post scraping is complete *********** \n\n\n\n\n\n")
                    break

        driver.execute_script("window.scrollTo(0, 0)")
        driver.find_element(By.XPATH, category_xpath).click()  # 설정되어있는 카테고리를 취소하는 클릭
        category_count += 1
        time.sleep(0.2)
    logging.info(df)

    hook = get_S3_connection()
    hook.load_string(
        string_data=df.to_csv(encoding='utf8', index=False),
        key='data/{date}/jumpit_en.csv'.format(date=date),
        bucket_name='oh-my-stack',
        replace=True
    )
    hook.load_string(
        string_data=df.to_csv(encoding='utf8', index=False),
        key='data/jumpit_en.csv',
        bucket_name='oh-my-stack',
        replace=True
    )

    print(f"\n\n\n\n\n\n *********** Whole scraping process of jumpit is over *********** \n\n\n\n\n\n")

    driver.quit()

get_post_info_jumpit = PythonOperator(
    task_id = 'get_post_info_jumpit',
    python_callable = get_post_info_jumpit,
    params = {
        'url': 'https://www.jumpit.co.kr/positions',
        'schema': 'raw_data',
        'table1': 'test_ai',
        'table2': 'test_en'
    },
    dag = dag
)








def get_post_info_programmers(**context):
    schema = context["params"]["schema"]
    table1 = context["params"]["table1"]
    table2 = context["params"]["table2"]
    url = context["params"]["url"]
    driver = get_page_with_selenium(url)

    def get_company_name():
        company = driver.find_element(By.XPATH, '/html/body/div[2]/div/div[1]/div[1]/div[1]/header/div/div[2]/h4/a').text
        return company

    def get_title():
        text = driver.find_element(By.XPATH, '/html/body/div[2]/div/div[1]/div[1]/div[1]/header/div/div[2]/div/h2').text
        text = core.replace_emoji(text, "")
        text = text.replace("'", "")
        return text

    def get_table():
        table_text = driver.find_element(By.XPATH, '/html/body/div[2]/div/div/div[1]/div[1]/section/div').text
        position = table_text.split('직무')[1]
        position = position.split('\n')[1]
        career = table_text.split('경력')[1]
        career = career.split('\n')[1]
        address = table_text.split('근무 위치')[1]
        address = address.split('\n')[1]
        return position, career, address

    def get_stack():
        text = driver.find_element(By.XPATH, '/html/body/div[2]/div/div[1]/div[1]/div[1]/div[2]/section/ul').text.replace('\n',',')
        return text

    def get_main_business():
        text = driver.find_element(By.XPATH, '/html/body/div[2]/div/div[1]/div[1]/div[1]/div[3]/section[1]/div').text
        text = core.replace_emoji(text, "")
        return text

    def get_qualification():
        qualification = driver.find_element(By.XPATH, '/html/body/div[2]/div/div[1]/div[1]/div[1]/div[3]/section[2]/div').text
        text = core.replace_emoji(qualification, "")
        return qualification

    def get_preferences():
        preferences = driver.find_element(By.XPATH, '/html/body/div[2]/div/div[1]/div[1]/div[1]/div[3]/section[3]/div').text
        text = core.replace_emoji(preferences, "")
        return preferences


    prim_num = 0
    page_count = 1
    df = pd.DataFrame(columns=['id', 'company', 'position', 'title', 'stack', 'main_business', 'qualification', 'preferences', 'career', 'address', 'site', 'date'])
    date = datetime.today().strftime("%Y-%m-%d %H:%M:%S")

    last_page_str = driver.find_element(By.XPATH, "/html/body/div[2]/div/div[3]/ul/li[8]/span").text
    last_page_str = last_page_str.replace(" ", "")
    last_page_int = int(last_page_str)

    while page_count < last_page_int:
        post_count = 1
        # get post information
        while post_count < 21:
            # go to post page
            try:
                driver.execute_script("window.scrollTo(0, 300)")
                time.sleep(0.5)
                post_xpath = f'/html/body/div[2]/div/section[2]/div/ul/li[{post_count}]/div[2]/div[1]/h5/a'
                driver.find_element(By.XPATH, post_xpath).click()
                # scrap post data
                try:
                    company = get_company_name()
                    title = get_title()
                    stack = get_stack()
                    main_business = get_main_business()
                    qualification = get_qualification()
                    preferences = get_preferences()
                    position, career, address = get_table()
                    site = driver.current_url
                    print((f"\n{page_count, company, post_count, position}\n"))
                    df.loc[len(df)] = [prim_num, company, position, title, stack, main_business, qualification,
                                       preferences, career, address, site, date]
                    time.sleep(0.2)
                except:
                    print(f"\n\n\n\n\n\n *********** Fail to get to the post text *********** \n\n\n\n\n\n")
                    continue
            except:
                print(f"\n\n\n\n\n\n *********** Fail to go to post page *********** \n\n\n\n\n\n")
                continue
            finally:
                driver.back()
                time.sleep(0.2)
                post_count += 1
                prim_num += 1
        page_count += 1
        # go to next page
        try:
            # ... marked on only right side
            next_page_button_when_only_xpath = '/html/body/div[2]/div/div[3]/ul/li[9]/span'
            # ... marked on both sides
            next_page_button_when_both_xpath = '/html/body/div[2]/div/div[3]/ul/li[11]/span'
            try:
                driver.find_element(By.XPATH, next_page_button_when_only_xpath).click()
            except:
                try:
                    driver.find_element(By.XPATH, next_page_button_when_both_xpath).click()
                # there are no pages left
                except:
                    print(f"\n\n\n\n\n\n *********** Fail to get to the next page *********** \n\n\n\n\n\n")
                    break
        # An unknown exception occurred
        except:
            print(f"\n\n\n\n\n\n *********** An unknown exception occurred *********** \n\n\n\n\n\n")
            break
    hook = get_S3_connection()
    hook.load_string(
        string_data=df.to_csv(encoding='utf8', index=False),
        key='data/{date}/programmers_en.csv'.format(date=date),
        bucket_name='oh-my-stack',
        replace=True
    )
    hook.load_string(
        string_data=df.to_csv(encoding='utf8', index=False),
        key='data/programmers_en.csv',
        bucket_name='oh-my-stack',
        replace=True
    )

    print(f"\n\n\n\n\n\n *********** Whole scraping process of programmers is over *********** \n\n\n\n\n\n")

get_post_info_programmers = PythonOperator(
    task_id = 'get_post_info_programmers',
    python_callable = get_post_info_programmers,
    params = {
        'url': 'https://career.programmers.co.kr/job',
        'schema': 'raw_data',
        'table1': 'test_ai',
        'table2': 'test_en'
    },
    dag = dag
)





trigger_to_preprocess = TriggerDagRunOperator(
    task_id='trigger_to_preprocess',
    trigger_dag_id='preprocessing_oms',
    dag=dag
)





[get_post_info_jumpit, get_post_info_programmers] >> trigger_to_preprocess