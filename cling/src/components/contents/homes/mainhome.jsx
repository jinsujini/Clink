import React, { useEffect, useState } from 'react';
import Header from '../../Header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { useNavigate } from 'react-router-dom';
import Down from "../../../assets/img/main/down.png"
import 'swiper/css';
import 'swiper/css/pagination';
import '../../../assets/scss/contents/homes/mainhome.scss';
import axios from 'axios';
import Loading from '../Loading';
import { motion } from 'framer-motion';

const Mainhome = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [noticeAll, setNoticeAll] = useState([]);
  const [myNotices, setMyNotices] = useState([]);
  const [showMyNotices, setShowMyNotices] = useState(false);

  const sortedNotices = [...noticeAll].reverse();
  const latestNotices = sortedNotices.slice(0, 5);

  useEffect(() => {
    allNotice();
  }, []);

  const allNotice = () => {
    axios.get('https://clinkback.store/notice', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
      .then((response) => {
        setNoticeAll(response.data);
        console.log(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('HOME 화면의 데이터를 불러오는 데 실패했습니다.', error);
        alert('HOME 화면의 데이터를 불러오는 데 실패했습니다.');
      });
  }

  const fetchMyNotices = () => {
    axios.get('https://clinkback.store/notice/my', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
    })
      .then((response) => {
        setMyNotices(response.data);
        console.log('내 글 목록:', response.data);
      })
      .catch((error) => {
        console.error('내 글 목록을 찾을 수 없습니다.', error);
        alert('내 글 목록을 찾을 수 없습니다.');
      });
  }

  const handleMyNotice = () => {
    if (showMyNotices) {
      allNotice(); 
    } else {
      fetchMyNotices(); 
    }
    setShowMyNotices(!showMyNotices);
  };

  const goNoticeWrite = () => {
    navigate('/noticeWrites');
    window.scrollTo(0, 0);
  };

  const goNoticeOpen = (id) => {
    console.log(`공지사항 상세보기 페이지로 이동합니다. ID: ${id}`);
    navigate(`/noticeOpen/${id}`);
    window.scrollTo(0, 0);
  };
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };


  return (
    <div id="mainhome">
      <Header />
      {loading ? (
       <Loading />
      ) : (
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible">
          <Swiper
            className="mainBanner"
            grabCursor={true}
            slidesPerView={'auto'}
            spaceBetween={170}
            pagination={{ clickable: true }}
            centeredSlides={true}
            autoplay={{ delay: 3000 }}
            modules={[Pagination, Autoplay]}
          >
            {latestNotices.map((notice, index) => {
              const firstImage = notice.images[0];
              const imageSrc = `data:image/jpg;base64,${firstImage.attachmentByteList}`;

              return (
                <>
                <SwiperSlide key={index} className="Slide" onClick={() => goNoticeOpen(notice.id)}>
                  <img src={imageSrc} alt={`slide-${index}`} className="imgBanner" />
                  <div className="mainTitle">
                    <div>{notice.title}</div>
                    <div className="down" onClick={() => goNoticeOpen(notice.id)}>
                  <img src={Down} alt="" />
                </div>
                  </div>
                </SwiperSlide>
               
                </>
              );
            })}
          </Swiper>
         
          <div className="myNoticeBox">
            <div className="myNotice" onClick={handleMyNotice}>
              {showMyNotices ? '전체 글 보기' : '내 글만 보기'}
            </div>
          </div>
          <div className="tableBox" >
            {(showMyNotices ? myNotices : sortedNotices).length === 0 && (
              <motion.div className="noNotices"
                variants={fadeIn}
                initial="hidden"
                animate="visible">{showMyNotices ? '작성한 게시글이 없습니다.' : ' '}</motion.div>
            )}
            {(showMyNotices ? myNotices : sortedNotices).map((notice, index) => (
              <motion.div key={index} className="noticeItem"
                variants={fadeIn}
                initial="hidden"
                animate="visible">
                <div id="notices" onClick={() => goNoticeOpen(notice.id)}>
                  <div className="noticeDate">{notice.createdDate}</div>
                  <div className="noticeTitle">{notice.title}</div>
                </div>
              </motion.div>
            ))}
          </div>
          <div>
            <button id="btnWrite" onClick={goNoticeWrite}>글 작성하기</button>
          </div>
        </motion.div>
      )}
    </div>

  );
}

export default Mainhome;
