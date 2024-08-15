import React, { useState, useEffect } from 'react';
import Trash from '../../../assets/img/crew/Trash.png';
import { motion } from 'framer-motion';
import Spinner from '../../../assets/img/loading.gif';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Support = () => {
    const [apply, setApply] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSupport = () => {
        axios.get('https://clinkback.store/application/my', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data);
                    setApply(res.data);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSupport();
    }, []);

    const fadeIn = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } }
    };

    const handleDeleteApply = (applyId) => {
        if (window.confirm('정말로 이 지원서를 삭제하시겠습니까?')) {
            setLoading(true);
            axios.put(`https://clinkback.store/application/display/${applyId}`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        console.log(res.data);
                        fetchSupport();
                        
                    }
                })
                .catch(err => {
                    console.error(err);
                    setLoading(false);
                });
        }
    };

    const step = (department) =>{
        axios.get(`https://clinkback.store/applications/${department}/info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    console.log(res.data.step);
                   return res.data.step;
                }
            })
            .catch(err => {
                console.error(err);
                
            });
    }



    const downFile = (id, name) => {
        axios.get(`https://clinkback.store/download/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            responseType: 'blob'
        })
            .then(res => {
                if (res.status === 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };


    return (
        <motion.div className="apply"
            variants={fadeIn}
            initial="hidden"
            animate="visible">
            <h2 className='sub-title'>현재 나의 지원 현황</h2>
            {loading ? (
                <div className="loading">
                    <img src={Spinner} alt="Loading..." />
                </div>
            ) : (
                apply.filter(item => item.view).length > 0 && (
                    apply.filter(item => item.view).map((item) => (
                        <div className="apply-crew" key={item.id}>
                            <div className="crewname">{item.recruitingDepartment}</div>

                            {item.firstResult === null ? (
                                <div className="result null">미정</div>
                            ) : (
                                <div className={`result first ${item.firstResult ? 'pass' : 'fail'}`}>
                                    {step(item.recruitingDepartment) === '1' ? (
                                       <>  { item.firstResult ? '최종 합격' : '불합격' }</>
                                    ) : (<> {item.firstResult ? '1차 합격' : '불합격'}</>
                                    )
                                    }

                                </div>
                            )}

                            {item.firstResult !== null && (
                                item.secondResult === null ? (
                                    <div className="result null">미정</div>
                                ) : (
                                    <div className={`result second ${item.secondResult ? 'pass' : 'fail'}`}>
                                        { item.secondResult ? '최종 합격' : '불합격' }
                                    
                                    
                                    </div>
                                )
                            )}


                            <div className="link">
                                {item.application.length > 0 && (
                                    <div onClick={() => downFile(item.application[0].id, item.application[0].originAttachmentName)}>
                                        내 지원서 다운로드
                                    </div>
                                )}
                                <div className='slash'>/</div>
                                <Link to={`/notice/${item.recruitment_id}`}>공지사항 보기</Link>
                                <img
                                    src={Trash}
                                    alt="쓰레기"
                                    className="trash-icon"
                                    onClick={() => handleDeleteApply(item.id)}
                                />
                            </div>
                        </div>
                    ))
                )
            )}
        </motion.div>
    );
};

export default Support;
