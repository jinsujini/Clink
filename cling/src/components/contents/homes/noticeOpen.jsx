import React, { useEffect, useState } from "react";
import Header from '../../Header';
import { useParams, useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { IoChevronBackCircleOutline } from "react-icons/io5";
import '../../../assets/scss/contents/homes/noticeOpen.scss';
import axios from 'axios';
import Spinner from '../../../assets/img/loading.gif';
import { motion } from 'framer-motion';

import 'swiper/css';
import 'swiper/css/pagination';


const NoticeOpen = () => {
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [images, setImages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true); //로딩 상태
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      opennotice();
      handleEditBox();
    }
  }, [id]);

  const opennotice = () => {
    axios.get(`https://clinkback.store/notice/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then((response) => {
        setNotice(response.data);
        const base64Images = response.data.images.map(image => `data:image/jpeg;base64,${image.attachmentByteList}`);
        setImages(base64Images);
        setIsLoading(false); // 데이터 로드 완료
      })
      .catch((error) => {
        console.error('게시글을 가져오는 중 오류가 발생했습니다.', error);
        setIsLoading(false);
      });
  };

  const handleEditBox = () => {
    axios.get(`https://clinkback.store/api/auth/getLoggedInUsername`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then((response) => {
        setCurrentUserId(response.data.toString());
      })
      .catch((error) => {
        console.error('userId를 가져오지 못했습니다.', error);
      });
  };

  const editNotice = () => {
    navigate(`/noticeEdit/${id}`);
  };

  const deleteNotice = () => {
    const userConfirmed = window.confirm('게시글을 삭제하시겠습니까?');

    if (userConfirmed) {
      axios.delete(`https://clinkback.store/notice/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
        .then(response => {
          alert('게시글이 삭제되었습니다');
          navigate(-1);
        })
        .catch(error => {
          console.error('오류가 발생했습니다.', error);
        });
    }
  };

  const goNoticeWrite = () => {
    navigate('/noticeWrites');
  };
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } }
  };

  return (
    <div id="noticeOpen">
      <Header />
      {isLoading ? (
        <div className="loading">
          <img src={Spinner} alt="" />
        </div>
      ) : (
        <motion.div className="wrap"
        variants={fadeIn}
          initial="hidden"
          animate="visible">
          <div id="imgbox">
            <Swiper
              className="mainBanner"
              grabCursor={true}
              slidesPerView={1}
              spaceBetween={30}
              pagination={{ clickable: true }}
              centeredSlides={true}
              autoplay={false}
              modules={[Pagination, Autoplay]}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index} className="Slide">
                  <img src={src} alt={`mage-${index}`} className="imghuman" />
                </SwiperSlide>
              ))
              }
            </Swiper>
          </div>
          <div id="contentBox">
            <div id="topBox">
              <IoChevronBackCircleOutline className="back" onClick={() => navigate(-1)} />
              <span className="text1">{notice.title}</span>

            </div>
            <div id="editBox1">
              {notice && currentUserId === notice.userId && (
                <div id="editBox2">
                  <span id="edit" onClick={editNotice}>수정하기</span>
                  <span> / </span>
                  <span id="delete" onClick={deleteNotice}>삭제하기</span>
                </div>
              )}
            </div>
            <span className="createdDate">{notice.createdDate}</span>
            <div id="contents">
              <span className="text2">{notice.content}</span>
            </div>
          </div>
          <div>
            <button id="btnWrite" onClick={goNoticeWrite}>글 작성하기</button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NoticeOpen;
