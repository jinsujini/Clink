import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../../assets/scss/contents/crew/passlist.scss';
import { motion } from 'framer-motion';
import List from './List';
import Spinner from '../../../assets/img/loading.gif';

const PassListItem = ({ department, step ,  recruitingId, plan}) => {
    const [students, setStudents] = useState([]);
    const [results, setResults] = useState({});
    const [isComplete, setIsComplete] = useState(false);
    const [first, setFirst] = useState(true);
    const [loading, setLoading] = useState(true);
    const [active, setActive] = useState(false);
    const [title, setTitle] = useState('');
    const [endStep, setEndStep] = useState(false);
    const [onStep, setOnStep] = useState('');

    useEffect(() => {
        setLoading(true);
        fetchStudents();

        if (step === '2') {
            setFirst(false);
            fetchStudents();
            fetchinfo();
        } else {
            setFirst(true);
            fetchStudents();
            fetchinfo();
        }
    }, [plan]);


    useEffect(() => {
        checkCompletion();
    }, [results]);

    useEffect(() => {
        fetchStudents();
        fetchinfo();
    }, [step]);

    const fetchStudents = () => {
        axios.get(`https://clinkback.store/applications/${department}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200 && Array.isArray(res.data)) {
                    const fetchedStudents = res.data;
                    setStudents(fetchedStudents);

                    const initialResults = {};
                    fetchedStudents.forEach(student => {
                        initialResults[student.studentId] = first ? student.firstResult : student.secondResult;
                    });
                    
                    setResults(initialResults);
                    setLoading(false);
                } else {
                    console.error(res.data);
                    setStudents([]);
                }

            })
            .catch(err => {
                console.error(err);
                setStudents([]);
            });
    };
    const fetchinfo = () => {
        axios.get(`https://clinkback.store/applications/${department}/info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setTitle(res.data.title);
                    setActive(parseInt(step) === parseInt(res.data.onStep));
                    setOnStep(res.data.onStep);


                    if (parseInt(step) + 1 === parseInt(res.data.onStep)) {
                        setEndStep(true);
                    } else {
                        setEndStep(false);
                    }
                }
            })
            .catch(err => {
                console.error(err);
            });
    };


    const handleSaveResults = () => {
        if (isComplete && (plan === onStep)) {
            axios.put(`https://clinkback.store/updateResults?step=${onStep}&recruitingId=${recruitingId}`, results, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            })
                .then(res => {
                    if (res.status === 200) {
                        alert('합격 및 불합격 정보가 저장되었습니다.');
                    }
                })
                .catch(err => {
                    console.error(err);
                });
        } else {
            alert('미정인 지원자가 있습니다. ');
        }
    };

    const handlePassClick = (studentId) => {
        setResults(prevResults => {
            const currentStatus = prevResults[studentId];
            const newStatus = currentStatus === null ? true : currentStatus === true ? false : null;
            return { ...prevResults, [studentId]: newStatus };
        });
    };

    const checkCompletion = () => {
        const allDecided = students.every(student => results[student.studentId] !== null && results[student.studentId] !== undefined);
        setIsComplete(allDecided);
    };


    const downFile = (id, name) => {
        axios.get(`https://clinkback.store/download/${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                responseType: 'blob'
            }
        })
            .then(res => {
                if (res.status === 200) {
                    setLoading(true);
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', name);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    setLoading(false);
                }
            })
            .catch(err => {
                console.error(err);
            });
    };

    const getButtonLabel = (result) => {
        if (result === null) return '미정';
        if (result === true) return '합격';
        if (result === false) return '불합격';
    };

    const getButtonClass = (result) => {
        if (result === null) return 'noselect';
        if (result === true) return 'pass';
        if (result === false) return 'nonpass';
    };

    return (
        <div>
            {loading ? (
                <div className="loading">
                    <img src={Spinner} alt="" />
                </div>
            ) : (
                <>
                    {first ? (
                        <>
                            {students.map((student) => (
                                <div key={student.studentId} className="row">
                                    <div className='passlist-info'>{student.studentId} {student.studentName}</div>
                                    <div className='passlist-file'>
                                        {student.application.length > 0 && (
                                            <div className="file" onClick={() => downFile(student.application[0].id, student.application[0].originAttachmentName)}>
                                                •  {student.application[0].originAttachmentName}
                                            </div>
                                        )}
                                    </div>
                                    <div className='passlist-select'>
                                        <button
                                            className={`select-pass ${getButtonClass(results[student.studentId])}`}
                                            onClick={() => handlePassClick(student.studentId)}
                                            disabled={!active}
                                        >
                                            {getButtonLabel(results[student.studentId])}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            {students.map((student) => (
                                <div key={student.studentId} className="row">
                                    {student.firstResult === true && (
                                        <>
                                            <div className='passlist-info'>{student.studentId} {student.studentName}</div>
                                            <div className='passlist-file'>
                                                {student.application.length > 0 && (
                                                    <div className="file" onClick={() => downFile(student.application[0].id, student.application[0].originAttachmentName)}>
                                                        •  {student.application[0].originAttachmentName}
                                                    </div>
                                                )}
                                            </div>
                                            <div className='passlist-select'>
                                                <button
                                                    className={`select-pass ${getButtonClass(results[student.studentId])}`}
                                                    onClick={() => handlePassClick(student.studentId)}
                                                    disabled={!active}
                                                >
                                                    {getButtonLabel(results[student.studentId])}
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </>
            )}

            <button className="send" onClick={handleSaveResults} disabled={!active}>합/불 입력 완료</button>
            <p className="send-text">※ 합/불 입력 완료 이후 지원자에게 메일이 발송되며 합/불 수정이 불가능합니다. </p>

            {endStep &&
                <List department={department} title={title} step={plan} />
            }


        </div>
    );
};

export default PassListItem;
