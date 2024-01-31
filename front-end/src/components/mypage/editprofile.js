import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../base/header';
import Footer from '../base/footer';
import MySidebar from './mysidebar';
import axios from 'axios';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import '../../components/style/editprofile.css';
import '../../components/style/mystack.css';
import { width } from '@mui/system';

function EditProfile() {
  const [nickName, setNickName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [academicAbility, setAcademicAbility] = useState(1);
  const [department, setDepartment] = useState(1);
  const [credit, setCredit] = useState('');
  const [userAddress, setUserAddress] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('Authorization');
        const response = await axios.get('https://api.ohmystack.co/api/user/userinfo', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const userInfo = response.data.body;
        setNickName(userInfo.nickName);
        setPhoneNumber(userInfo.phoneNumber);
        setAcademicAbility(userInfo.academicAbility.id);
        setDepartment(userInfo.department.id);
        setCredit(userInfo.credit);
        setUserAddress(userInfo.userAddress);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const data = {
      nickName,
      phoneNumber: parseInt(phoneNumber),
      academicAbility: { id: academicAbility },
      department: { id: department },
      credit,
      userAddress,
    };

    const token = localStorage.getItem('Authorization');

    axios
      .put('https://api.ohmystack.co/api/user/userinfo', data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(JSON.stringify(response.data));
        // 수정 완료 후 변경된 정보 알림
        alert('수정이 완료되었습니다.');
        // 나의 회원 정보 페이지로 이동
        navigate('/mypage/myprofile');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleFindAddress = () => {
    new window.daum.Postcode({
      oncomplete: function (data) {
        setUserAddress(data.address);
      },
    }).open();
  };

  const academicAbilityOptions = [
    { id: 1, title: '선택안함' },
    { id: 2, title: '고졸' },
    { id: 3, title: '대졸' },
    { id: 4, title: '석사' },
  ];

  const departmentOptions = [
    { id: 1, title: '선택안함' },
    { id: 2, title: '컴퓨터공학과' },
    { id: 3, title: '통계학과' },
    { id: 4, title: '소프트웨어공학과' },
    { id: 5, title: '정보통신학과' },
    { id: 6, title: '산업공학과' },
    { id: 7, title: '비전공' },
    { id: 8, title: '그외 IT 전공' },
  ];

  return (
    <>
      <Header />
      <div className="mypage-container">
        <MySidebar />
        <div className="myedit_content">
          <h3 className='infomodify'>정보 수정</h3>
          <div className='edit_profile'>
            <form className="edit_field" onSubmit={handleFormSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    id="nickName"
                    label="닉네임"
                    variant="standard"
                    style={{ marginRight: "30px", marginBottom: "20px" }}
                    value={nickName}
                    onChange={(e) => setNickName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="phoneNumber"
                    label="전화번호"
                    variant="standard"
                    style={{ marginBottom: "20px" }}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/, ''))}
                  />
                </Grid>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box width={200}>
                    <TextField
                      id="academicAbility"
                      label="학력"
                      variant="standard"
                      style={{ marginRight: "30px", marginBottom: "20px", width: '120px' }}
                      select
                      value={academicAbility}
                      onChange={(e) => setAcademicAbility(parseInt(e.target.value))}
                    >
                      {academicAbilityOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box width={200}>
                    <TextField
                      id="department"
                      label="학과"
                      variant="standard"
                      style={{ marginBottom: "20px", width: "145px" }}
                      select
                      value={department}
                      onChange={(e) => setDepartment(parseInt(e.target.value))}
                    >
                      {departmentOptions.map((option) => (
                        <MenuItem key={option.id} value={option.id}>
                          {option.title}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                </Grid>
              </Grid>
              <TextField
                id="credit"
                label="학점"
                variant="standard"
                style={{ marginBottom: "20px" }}
                value={credit}
                onChange={(e) => setCredit(e.target.value)}
                placeholder="만점은 4.5입니다." // 학점 입력 안내 문구 추가
              />
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  id="userAddress"
                  label="주소"
                  variant="standard"
                  style={{ marginRight: "30px", marginBottom: "20px", width: "300px" }}
                  value={userAddress}
                  disabled={true}
                  placeholder="주소찾기 버튼을 누르세요."
                />
                <Stack spacing={2} direction="row">
                  <Button variant="text" style={{ color: '#bb44e4' }} onClick={handleFindAddress}>
                    찾기
                  </Button>
                </Stack>
              </div>
              <Stack spacing={2} direction="row" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Button variant="light" className='modifybtn' style={{ backgroundColor: '#000000', color: '#ffffff' }} onClick={handleFormSubmit}>
                  수정하기
                </Button>
              </Stack>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default EditProfile;
