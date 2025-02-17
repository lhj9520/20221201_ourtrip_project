import React, { useRef, useEffect } from "react";
import "./modal.css";

const Modal = (props) => {
  // 열기, 닫기, 모달 헤더 텍스트를 부모로부터 받아옴
  const { open, close, header } = props;

  // Modal 창을 useRef로 취득
  const modalRef = useRef(null);

  // 모달 외부 클릭시 끄기 처리
  useEffect(() => {
    // 이벤트 핸들러 함수
    const handler = (event) => {
      // mousedown 이벤트가 발생한 영역이 모달창이 아닐 때, 모달창 제거 처리
      modalRef.current && !modalRef.current.contains(event.target) && close();
    };

    // 이벤트 핸들러 등록
    document.addEventListener("mousedown", handler);
    // document.addEventListener('touchstart', handler); // 모바일 대응

    return () => {
      // 이벤트 핸들러 해제
      document.removeEventListener("mousedown", handler);
      // document.removeEventListener('touchstart', handler); // 모바일 대응
    };
  });

  return (
    // 모달이 열릴때 openModal 클래스가 생성된다.
    <div className={open ? "openModal modal" : "modal"}>
      {open ? (
        <section ref={modalRef}>
          <header>
            {header}
            <button className="close" onClick={close} type="button">
              &times;
            </button>
          </header>
          <main>{props.children}</main>
          <footer>
            <button className="close" onClick={close} type="button">
              close
            </button>
          </footer>
        </section>
      ) : null}
    </div>
  );
};

export default Modal;
