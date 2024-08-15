import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../../Header';
import left from '../../../assets/img/crew/left.png';
import '../../../assets/scss/contents/crew/notice.scss';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import Spinner from '../../../assets/img/loading.gif';

const NoticeDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recruiting, setRecruiting] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [file, setFile] = useState('');
    const [errorVisible, setErrorVisible] = useState(false);
    const [check, setCheck] = useState(false);

    const handleBackClick = () => {
        navigate(-1);
    };

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
    };

    useEffect(() => {
        axios.get(`https://clinkback.store/recruitment/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setRecruiting(res.data);
                    setLoading(false);
                    applyCheck();
                    console.log(res);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }, [id]);

    const downFile = (id, name) => {
        axios.get(`https://clinkback.store/download/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                responseType: 'blob' 
            }
        })
            .then(res => {
                if (res.status === 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${name}`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };
    const applyCheck = () =>{
        axios.get(`https://clinkback.store/recruitment/apply/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setCheck(res.data);
                    console.log(res.data);
                }
            })
            .catch(err => {
                console.error(err);
            });
    }

    const uploadFile = () => {
        if (!selectedFile) {
            setFile('첨부파일이 없습니다.');
            setErrorVisible(true);
            setTimeout(() => {
                setErrorVisible(false);
            }, 3000);
            return;
        }

        const formData = new FormData();
        formData.append('application', selectedFile);


        axios.post(`https://clinkback.store/recruitment/apply/${id}`, formData, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'multipart/form-data',
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log(res);
                    alert('지원서가 성공적으로 전송되었습니다.');
                    navigate(-1);
                }
            })
            .catch(err => {
                console.error(err);
                alert('지원서 전송에 실패했습니다.');

            });
    };

    return (
        <div className='noticedetail'>
            <Header />
            {loading ? (
                <img src={Spinner} alt="로딩" className='loading' />
            ) : (
                <motion.div className="wrap"
                    variants={fadeIn}
                    initial="hidden"
                    animate="visible">

                    <div className="title">
                        <img src={left} alt="뒤로가기" onClick={handleBackClick} />
                        <h1>{recruiting?.title || '제목 없음'}</h1>
                    </div>

                    <div className="notice">
                        <div className="sub">
                            <div className="day">
                                <h2>모집일정</h2>
                                <div className="today">{recruiting?.startDate || '미정'}</div>
                                <div className="halfline"></div>
                                <div className="endday">{recruiting?.dueDate || '미정'}</div>
                            </div>
                            <div className="plan-select">
                                <h2>선발계획</h2>
                                <div className="plan"><span>{recruiting?.step || '1'}</span>차</div>
                            </div>
                        </div>
                        <div className="contents">
                            <div className="img-box">
                                {recruiting?.images && recruiting.images.map((image) => (
                                    <img 
                                        key={image.id} 
                                        src={`data:image/jpg;base64,${image.attachmentByteList}`} 
                                        alt={image.originAttachmentName} 
                                    />
                                ))}
                            </div>
                            <div className="text-box">
                                {recruiting?.content
                                    ? recruiting.content.split('\n').map((line, index) => (
                                        <p key={index}>{line}</p>
                                    ))
                                    : <p>내용 없음</p>}
                            </div>
                            <div className="file">
                                <h2>•</h2>
                                {recruiting?.files && recruiting.files.map((file) => (
                                    <div className="filename" key={file.id}>
                                        <div onClick={() => downFile(file.id, file.originAttachmentName)}>{file.originAttachmentName}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="line"></div>
                        <div id="btnBox">
                            <div className="inputfile">
                                {selectedFile && <span>•  {selectedFile.name}</span>}
                            </div>

                            {errorVisible && <motion.div className="error"
                                variants={fadeIn}
                                initial="hidden"
                                animate="visible">{file}</motion.div>}

                            <div className={`send-file ${check ? 'disabled' : ' '}`} >
                                <label htmlFor="file">파일 첨부하기</label>
                                <input type="file" id="file" onChange={(e) => setSelectedFile(e.target.files[0])} style={{ display: 'none' }} disabled={check} />
                            </div>

                            <button className={`send ${check ? 'disabled' : ' '}`} onClick={uploadFile} disabled={check}>
                                지원하기
                            </button>

                        </div>
                        {check && <span className="ment red">이미 지원한 크루입니다.</span>}
                        <div className="ment">
                            ※지원하기 버튼을 누른 후에는 지원을 취소할 수 없습니다.</div>

                    </div>
                  
                </motion.div>
            )}

            <div className="empty"></div>
            <div className="empty"></div>
        </div>
    );
};

export default NoticeDetail;
