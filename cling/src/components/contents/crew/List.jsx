import React, { useState } from 'react';
import Spinner from '../../../assets/img/loading.gif';
import Folder from '../../../assets/img/crew/Folder.png';
import axios from 'axios';

const List = ({ department, step, title }) => {

    const listDown = () => {
        axios.get('https://clinkback.store/downloadStudentList', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                'Content-Type': 'text/plain'
            },
            responseType: 'blob',
            params: {
                recruitingDepartment: department,
                step: step
            }
        })
            .then(res => {
                if (res.status === 200) {
                    const url = window.URL.createObjectURL(new Blob([res.data], { type: 'text/plain' }));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', `${title}.txt`);
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

        <div className="list-down">
                <h2 className="sub-title">최종 합격자 명단 다운로드</h2>
                <div className="file">
                    <img src={Folder} alt="Folder" />
                    <div className="filename" onClick={listDown}>
                        {title}
                    </div>
                </div>
      
        </div>

    );
}

export default List;
