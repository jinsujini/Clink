import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import '../../../assets/scss/contents/matching/match_info.scss';
import axios from 'axios';

const majorLists = [
    { value: '국어국문학과', label: '국어국문학과' },
    { value: '영어영문학과', label: '영어영문학과' },
    { value: '독일어문·문화학과', label: '독일어문·문화학과' },
    // ... 생략된 전공 목록
];

const MatchInfo = () => {
    const navigate = useNavigate();
    const [studentId, setStudentId] = useState('');
    const [major, setMajor] = useState('');

    const clinkSame = async (path) => {
        if (!studentId || !major) {
            alert('학번과 전공을 모두 입력해주세요.');
            return;
        }

        try {
            const response = await axios.get('https://clinkback.store/clink-same', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            navigate(path, { state: { profiles: response.data } });
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('데이터를 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    const clinkOther = async (path) => {
        if (!studentId || !major) {
            alert('학번과 전공을 모두 입력해주세요.');
            return;
        }

        try {
            const response = await axios.get('https://clinkback.store/clink-other', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            navigate(path, { state: { profiles: response.data } });
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('데이터를 가져오는 중 오류가 발생했습니다. 나중에 다시 시도해 주세요.');
        }
    };

    return (
        <div className='matchinfo'>
            <Header />
            <div>
                <h1 className="text">같은 학번 수정이와 크링해보세요!</h1>
            </div>

            <div className='matching-form'>
                <input
                    className="studentId"
                    type="text"
                    placeholder='Student id'
                    onChange={(e) => setStudentId(e.target.value)}
                />

                <select className="major" onChange={(e) => setMajor(e.target.value)}>
                    <option value="">Major</option>
                    {majorLists.map((major) => (
                        <option key={major.value} value={major.value}>{major.label}</option>
                    ))}
                </select>

                <div className="button-group">
                    <input
                        className="matchingbtn"
                        type="button"
                        value="Clink"
                        onClick={() => clinkSame('/samemajor')}
                    />
                    <input
                        className="matchingbtn"
                        type="button"
                        value="타 과 Clink"
                        onClick={() => clinkOther('/othermajor')}
                    />
                </div>
            </div>
        </div>
    );
};

export default MatchInfo;
