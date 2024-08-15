import React from 'react'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Checkschool from "./components/contents/user/CheckSchool";
import Landing from './components/landing';
import NoticeWrite from './components/contents/crew/NoticeWrite';
import NoticeWrites from './components/contents/homes/noticeWrites';
import NoticeEdit from './components/contents/homes/noticeEdit';
import NoticeOpen from './components/contents/homes/noticeOpen';
import Myhome from "./components/contents/my/myhome";

import Main from './components/Main';
import Mainhome from './components/contents/homes/mainhome';
import Create from './components/contents/user/create';
import MatchingInfo from './components/contents/matching/match_info';
import Samemajor from './components/contents/matching/samemajor';
import Othermajor from './components/contents/matching/othermajor';
import Match from './components/contents/matching/match';
import Matchprofile from './components/contents/matching/match_profile';
import Loading from './components/contents/matching/loading';
import Chat from './components/contents/chat/chat';
import Login from './components/contents/user/Login';
import Findpw from './components/contents/user/Findpw';
import Newpw from './components/contents/user/Newpw';
import Crew from './components/contents/crew/Crew';
import Mycrew from './components/contents/crew/Mycrew';   
import NoticeDetail from './components/contents/crew/NoticeDetail';  
import PassList from './components/contents/crew/PassList';



import './assets/scss/section/base.scss'

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<Landing />} />
                <Route path='/mainhome' element={<Mainhome />} />
                <Route path='/login/findpw' element = {<Findpw />} />
                <Route path='/login/newpw' element = {<Newpw />} />
                <Route path='/crew' element = {<Crew />} />
                <Route path='/mycrew' element = {<Mycrew />} />
                <Route path='/mycrew/PassList' element = {<PassList />} />
                <Route path='/mycrew/:department' element={<Mycrew />} />  
                <Route path='/notice/:id' element={<NoticeDetail />} />   

                <Route path='/create' element={<Checkschool />} />
                <Route path='/login' element={<Login />} />
                <Route path='/noticeWrite' element={<NoticeWrite />} />
                <Route path='/noticeWrite/:department' element={<NoticeWrite />} />
                <Route path='/noticeWrites' element={<NoticeWrites />} />
                <Route path='/noticeEdit/:id' element={<NoticeEdit />} />
                <Route path='/noticeOpen/:id' element={<NoticeOpen />} /> 
                
                <Route path='/myhome' element={<Myhome />} />
                <Route path='/create/info' element={<Create />} />
                <Route path='/match/info' element={<MatchingInfo />} />
                <Route path='/samemajor' element={<Samemajor />} />
                <Route path='/othermajor' element={<Othermajor />} />
                <Route path='/match' element={<Match />} />
                <Route path="/matchprofile/:studentId" element={<Matchprofile />} />
                <Route path="/loading" element={<Loading />} />
                <Route path="/chat/:roomId" element={<Chat />} />

               
                
                
            </Routes>
        </BrowserRouter>

    );
}

export default App;
