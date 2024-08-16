import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../Header';
import '../../../assets/scss/contents/matching/match_info.scss';
import axios from 'axios';

const majorLists = [
    { value: '국어국문학과', label: '국어국문학과' },
    { value: '영어영문학과', label: '영어영문학과' },
    { value: '독일어문·문화학과', label: '독일어문·문화학과' },
    { value: '프랑스어문·문화학과', label: '프랑스어문·문화학과' },
    { value: '일본어문·문화학과', label: '일본어문·문화학과' },
    { value: '중국어문·문화학과', label: '중국어문·문화학과' },
    { value: '사학과', label: '사학과' },
    { value: '문화예술경영학과', label: '문화예술경영학과' },
    { value: '정치외교학과', label: '정치외교학과' },
    { value: '심리학과', label: '심리학과' },
    { value: '지리학과', label: '지리학과' },
    { value: '경제학과', label: '경제학과' },
    { value: '미디어커뮤니케이션학과', label: '미디어커뮤니케이션학과' },
    { value: '경영학부', label: '경영학부' },
    { value: '사회복지학과', label: '사회복지학과' },
    { value: '의류산업학과', label: '의류산업학과' },
    { value: '소비자생활문화산업학과', label: '소비자생활문화산업학과' },
    { value: '뷰티산업학과', label: '뷰티산업학과' },
    { value: '수리통계데이터사이언스학부', label: '수리통계데이터사이언스학부' },
    { value: '통계학과', label: '통계학과' },
    { value: '생명과학·화학부', label: '생명과학·화학부' },
    { value: '법학부', label: '법학부' },
    { value: '화학과', label: '화학과' },
    { value: '화학·에너지융합학부', label: '화학·에너지융합학부' },
    { value: '바이오신약의과학부', label: '바이오신약의과학부' },
    { value: '바이오헬스융합학부', label: '바이오헬스융합학부' },
    { value: '서비스·디자인공학과', label: '서비스·디자인공학과' },
    { value: '융합보안공학과', label: '융합보안공학과' },
    { value: '컴퓨터공학과', label: '컴퓨터공학과' },
    { value: '청정융합에너지공학과', label: '청정융합에너지공학과' },
    { value: '바이오식품공학과', label: '바이오식품공학과' },
    { value: '바이오생명공학과', label: '바이오생명공학과' },
    { value: 'AI융합학부', label: 'AI융합학부' },
    { value: '간호학과', label: '간호학과' },
    { value: '교육학과', label: '교육학과' },
    { value: '사회교육과', label: '사회교육과' },
    { value: '윤리교육과', label: '윤리교육과' },
    { value: '한문교육과', label: '한문교육과' },
    { value: '유아교육과', label: '유아교육과' }
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
