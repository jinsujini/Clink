import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Header from '../../Header';
import '../../../assets/scss/contents/crew/noticeWrite.scss';
import left from '../../../assets/img/crew/left.png';
import Trash from '../../../assets/img/crew/Trash.png';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Compressor from 'compressorjs';

const NoticeWrite = () => {
    const { department } = useParams();
    const [title, setTitle] = useState('');
    const [endDate, setEndDate] = useState(new Date());
    const [selectionPlan, setSelectionPlan] = useState('1');
    const [content, setContent] = useState('');
    const [images, setImages] = useState([]);
    const [files, setFiles] = useState([]);
    const [imageNames, setImageNames] = useState([]);
    const [fileNames, setFileNames] = useState([]);
    const navigate = useNavigate();

    const write = () => {
        const formData = new FormData();
        formData.append('recruitingDepartment', department);
        formData.append('title', title);
        formData.append('content', content);
        formData.append('step', selectionPlan);
        formData.append('startDate', formattedDate);
        formData.append('dueDate', endDate.toISOString().split('T')[0]);

        images.forEach(image => formData.append('images', image));
        files.forEach(file => formData.append('file', file));

        axios.post('https://clinkback.store/recruitment/write', formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    navigate(-1);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    const today = new Date();
    const formattedDate = `${today.getFullYear()}/${String(today.getMonth() + 1).padStart(2, '0')}/${String(today.getDate()).padStart(2, '0')}`;

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + images.length > 5) {
            alert('최대 5장까지 업로드할 수 있습니다.');
            return;
        }

        files.forEach(file => {
            new Compressor(file, {
                quality: 0.3,
                success(result) {
                    setImages(prevImages => [...prevImages, result]);
                    setImageNames(prevNames => [...prevNames, result.name]);
                },
                error(err) {
                    console.error(err.message);
                }
            });
        });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFileNames = files.map(file => file.name);
        setFiles(prevFiles => [...prevFiles, ...files]);
        setFileNames(prevFileNames => [...prevFileNames, ...newFileNames]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
        setImageNames(imageNames.filter((_, i) => i !== index));
    };

    const removeFile = (index) => {
        setFiles(files.filter((_, i) => i !== index));
        setFileNames(fileNames.filter((_, i) => i !== index));
    };

    return (
        <div id="noticeWrite">
            <Header />
            <div className="wrap">
                <div className="title">
                    <img src={left} alt="뒤로가기" onClick={handleBackClick} />
                    <h1>{department}</h1>
                </div>
                <div className="form">
                    <input
                        id="title"
                        type="text"
                        placeholder="제목을 작성하세요"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <div className="plan">
                        <div className="day">
                            <h2>모집일정</h2>
                            <div className="today">{formattedDate}</div>
                            <h2>-</h2>
                            <DatePicker
                                selected={endDate}
                                onChange={(date) => setEndDate(date)}
                                dateFormat="yyyy/MM/dd"
                                className="endday"
                            />
                        </div>
                        <div className="plan-select">
                            <h2>선발계획</h2>
                            <select
                                value={selectionPlan}
                                onChange={(e) => setSelectionPlan(e.target.value)}
                            >
                                <option value="1">1차</option>
                                <option value="2">2차</option>
                            </select>
                        </div>
                    </div>
                    <textarea
                        id="contents"
                        placeholder="지원자들의 혼동을 줄이기위해 글 작성 이후 수정이 제한되어있습니다."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>

                <div id="btnBox">
                    <ul className="preview">
                        {imageNames.length > 0 && (
                            <li className="image-preview">
                                {imageNames.map((name, index) => (
                                    <div key={index} className="file-item">
                                        <p className="file-name">{name}</p>
                                        <img
                                            src={Trash}
                                            alt="삭제"
                                            className="trash-icon"
                                            onClick={() => removeImage(index)}
                                        />
                                    </div>
                                ))}
                            </li>
                        )}
                        {fileNames.length > 0 && (
                            <li className="file-preview">
                                {fileNames.map((name, index) => (
                                    <div key={index} className="file-item">
                                        <p className="file-name">{name}</p>
                                        <img
                                            src={Trash}
                                            alt="삭제"
                                            className="trash-icon"
                                            onClick={() => removeFile(index)}
                                        />
                                    </div>
                                ))}
                            </li>
                        )}
                    </ul>
                    <label htmlFor="send-img" className='send-img'>이미지 업로드</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        id="send-img"
                        multiple
                    />

                    <label htmlFor='send-file' className="send-file">파일 첨부하기</label>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        id='send-file'
                        multiple
                    />

                    <button className="send" onClick={write}>
                        작성완료
                    </button>
                </div>
            </div>
            <div className="empty"></div>
        </div>
    );
}

export default NoticeWrite;
