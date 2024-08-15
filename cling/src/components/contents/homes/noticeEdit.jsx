import React, { useEffect, useState, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Header from '../../Header';
import '../../../assets/scss/contents/homes/noticeEdit.scss';
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

const NoticeEdit = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const imageInput = useRef();
  const [fileNames, setFileNames] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState('');
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태


  useEffect(() => {
    if (id) {
        openEditNotice();
    }
  }, [id]);

  const openEditNotice = () => {
    axios.get(`https://clinkback.store/notice/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then((response) => {
      const { title, content, images } = response.data;
      setTitle(title);
      setContent(content);
      const imageNames = images.map(img => img.originAttachmentName);
      setFileNames(imageNames); // 기존 이미지 이름 
      setIsLoading(false);
    })
    .catch((error) => {
      setIsLoading(false);
      console.error('수정 페이지에 필요한 데이터를 가져오지 못했습니다.', error);
    });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    
    if (title === '' || content === '') {
      alert('게시글의 제목 또는 내용을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('id', id);
    formData.append('title', title);
    formData.append('content', content);
    
    if (images.length > 0) {
      images.forEach(image => formData.append('images', image));
    }

    axios.put('https://clinkback.store/notice/update', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
    .then(response => {
        if (response.status === 200) {
            alert('게시글 수정이 완료되었습니다');
            navigate(-1);
        }
    })
    .catch(err => {
      console.error(err)
        alert('게시글 수정 중 오류가 발생했습니다.');
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
    setImages(files);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div id="noticeEdit">
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
            ref={imageInput}
            className="fileInput"
            multiple
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
        <button className="button2" onClick={handleUpdate}>
        수정완료
        </button>
      </div>
    </div>
  );
};

export default NoticeEdit;
