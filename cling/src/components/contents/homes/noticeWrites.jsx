import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Header';
import '../../../assets/scss/contents/homes/noticeWrites.scss';
import styled from 'styled-components';
import axios from 'axios';

const FileInputWrapper = styled.div`
  .fileInput {
    display: none;
  }

  .customFileUpload {
    border: 1px solid #ccc;
    display: inline-block;
    padding: 6px 12px;
    cursor: pointer;
  }

  .fileNames {
    margin-left: 10px;
    list-style-type: none;
    padding: 0;
  }

  .fileNames li {
    margin-bottom: 5px;
  }
`;

const NoticeWrites = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [fileNames, setFileNames] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const imageInput = useRef(null);
  const [images, setImages] = useState([]);


  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (title === '' || content === '') {
      alert('게시글의 제목 또는 내용을 입력해주세요.');
      return;
    }
    if (fileNames.length === 0) {
      alert('메인홈에 게시할 이미지를 한 장 이상 첨부해주세요.');
      return;
    }
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    images.forEach(image => formData.append('images', image));
    
    axios.post('https://clinkback.store/notice/write', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then(response => {
        if (response.status === 200) {
            console.log(response);
            alert('게시글 등록이 완료되었습니다');
            navigate(-1);
        }
    })
    .catch(err => {
        console.error(err);
        alert('게시글 등록 중 오류가 발생했습니다.');
    });
};

  const onClickImageUploads = () => {
    imageInput.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert('이미지는 최대 10장까지 첨부 가능합니다.');
      return;
    }
    setFileNames(files.map(file => file.name));
    setImages(files);  // 파일들 저장 
  };
  
  return (
    <div id="noticeWrites">
      <Header />
      <form className="form">
        <textarea  
          id="title" 
          placeholder="제목을 작성하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)} 
          rows={1}
        />
        <textarea 
          id="contents"
          placeholder="내용을 입력하세요" 
          value={content}
          onChange={(e) => setContent(e.target.value)}
          />
      </form>
      <div id="btnBox">
        <FileInputWrapper>
          <input
            type="file"
            accept="image/jpg, image/png, image/jpeg"
            className="fileInput"
            ref={imageInput}
            multiple
            name="images"
            onChange={handleFileChange}
          />
          <div className="btnUpload" onClick={onClickImageUploads}>
            <button className="button1">이미지 업로드</button>
          </div>
          <ul className="fileNames">  
            {fileNames.map((fileName, index) => (
              <li key={index}>{fileName}</li>
            ))}
          </ul>
        </FileInputWrapper>
        <button className="button2" onClick={handleSubmit}>
          작성완료
        </button>
      </div>
    </div>
  );
};

export default NoticeWrites;
