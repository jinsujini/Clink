import React, { useEffect, useState } from 'react';
import PassListItem from './PassListItem';
import axios from 'axios';

import '../../../assets/scss/contents/crew/passlist.scss';

const PassList = ({ department }) => {
    const [plan, setPlan] = useState('1');
    const [viewPlan, setViewPlan] = useState('1');
    const [id, setId] = useState('');

    const fetch = () => {
        axios.get(`https://clinkback.store/applications/${department}/info`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        })
        .then(res => {
            if (res.status === 200) {
                console.log(res.data);
                setPlan(res.data.step);
                
                setId(res.data.id);

            }
        })
        .catch(err => {
            console.error(err);
        });
    };

    useEffect(() => {
        fetch();
    }, [department]);


    const getPlanOptions = (plan) => {
        if (plan === '2') {
            return (
                <>
                    <option value="1" >1차</option>
                    <option value="2">2차</option>
                </>
            );
        } else {
            return (
                <option value="1">1차</option>
            );
        }
    };

    return (
        <div className='passlist'>
             <select className="plan" onChange={(e) => setViewPlan(e.target.value)} >
                {getPlanOptions(plan)}
            </select>
            <div className="table-title">
                <div className='passlist-item'>학번/이름</div>
                <div className='passlist-item'>첨부파일</div>
                <div className='passlist-item'>합/불</div>
            </div>
           
            <PassListItem department = {department} onStep = {viewPlan} recruitingId={id}  plan = {plan} />
        </div>
    );
};

export default PassList;
