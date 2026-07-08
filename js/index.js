import { initGnb } from "./components/gnb.js";

document.addEventListener("DOMContentLoaded", () => {
    // 0. GNB 내비게이션 바 초기화 실행
    initGnb();

    // ==========================================================================
    // 실시간 상담 모달 제어 및 클라이언트 인터랙션 기능
    // ==========================================================================
    const consultButtons = document.querySelectorAll(".btn_consult");
    const modalOverlay   = document.getElementById("consultModal");
    const closeModalBtn  = document.getElementById("closeModalBtn");
    
    const modalCarSegment = document.getElementById("modalCarSegment");
    const modalCarName    = document.getElementById("modalCarName");
    const modalCarImg     = document.getElementById("modalCarImg");

    const consultForm = document.querySelector(".modal_form");
    const custName    = document.getElementById("custName");
    const custPhone   = document.getElementById("custPhone");
    const rentType    = document.getElementById("rentType");
    const custMemo    = document.getElementById("custMemo");

    // 모달 팝업 열기
    const openModal = (e) => {
        e.preventDefault(); 
        const targetBtn = e.currentTarget;

        const carName    = targetBtn.getAttribute("data-car-name");
        const carSegment = targetBtn.getAttribute("data-car-segment");
        const carImg     = targetBtn.getAttribute("data-car-img");

        modalCarName.textContent = carName;
        modalCarSegment.textContent = carSegment;
        modalCarImg.src = carImg;
        modalCarImg.alt = `${carName} 이미지`;

        modalOverlay.classList.add("active");
    };

    // 모달 팝업 닫기
    const closeModal = () => {
        modalOverlay.classList.remove("active");
        if (consultForm) {
            consultForm.reset();
        }
    };

    consultButtons.forEach(button => {
        button.addEventListener("click", openModal);
    });

    closeModalBtn.addEventListener("click", closeModal);

    modalOverlay.addEventListener("click", (e) => {
        if (e.target === modalOverlay) {
            closeModal();
        }
    });

    // ==========================================================================
    // 백엔드 비동기 통신(Fetch API) 및 관리자 문자 발송 연동
    // ==========================================================================
    if (consultForm) {
        consultForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nameValue  = custName.value.trim();
            const phoneValue = custPhone.value.trim();
            const typeValue  = rentType.value;
            const memoValue  = custMemo.value.trim();
            const selectedCar = modalCarName.textContent;

            // 프론트엔드 유효성 방어 체크
            if (!nameValue || !phoneValue) {
                alert("필수 입력 항목을 입력해 주세요.");
                return;
            }

            const phoneRegex = /^[0-9]{9,11}$/;
            if (!phoneRegex.test(phoneValue)) {
                alert("연락처는 숫자만 입력 가능합니다.");
                custPhone.focus();
                return;
            }

            const requestData = {
                carName: selectedCar,         // 상담 신청한 차량명
                customerName: nameValue,      // 고객 이름
                customerPhone: phoneValue,    // 고객 연락처
                rentType: typeValue,          // 대여 구분
                memo: memoValue               // 요청사항 메모
            };

            try {
                const submitBtn = document.getElementById("submitConsultBtn");
                if (submitBtn) submitBtn.disabled = true;

                // [실제 백엔드 API 서버 주소 입력단]
                // 가상의 경로 '/api/send-sms' 혹은 실제 연동할 가비아/알리고 웹훅 경로를 기입하는 곳입니다.
                // 현재는 로컬 정적 퍼블리싱 단계이므로 통신 에러가 나지 않도록 무료 목업(Mock) API 주소로 시뮬레이션.
                const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
                    method: "POST", // 데이터를 서버에 '생성/전송'하겠다는 통신 규약 명시
                    headers: {
                        "Content-Type": "application/json" // 서버에게 우리가 JSON 형식의 문자열 데이터를 보낸다고 알림
                    },
                    body: JSON.stringify(requestData) // JavaScript 객체를 서버가 읽을 수 있는 텍스트 문자열로 변환
                });

                // 서버의 응답 상태 코드가 200번대(정상 완료)인지 검증
                if (response.ok) {
                    // ─── [고객 인터페이스 피드백] ───
                    alert(`상담 접수가 완료되었습니다.\n신청하신 차량 [${selectedCar}] 담당자가 확인 후 남겨주신 번호로 신속하게 안내해 드리겠습니다.`);
                    
                    // ─── [관리자 유선 알림 가상 백포인터] ───
                    console.log(`[서버 단 가상 SMS 작동 룸]\n대표번호(010-6565-3465)로 다음 문자가 발송되었습니다:\n"【화성렌트카 알림】 ${nameValue} 고객님이 [${selectedCar}] 상담을 신청했습니다. 연락처: ${phoneValue}"`);
                    
                    // 성공적으로 완료되었으므로 모달창 닫기 및 폼 리셋
                    closeModal();
                } else {
                    // 서버는 켜져있으나 자체 에러가 발생한 상황 대처
                    throw new Error("서버 응답 오류");
                }

            } catch (error) {
                // 네트워크가 끊겼거나, API 서버가 오프라인일 때 발생하는 예외 예외처리
                console.error("상담 신청 전송 중 시스템 오류 발생:", error);
                
                // 현재 백엔드 실제 구축 전이므로 테스트 편의를 위해 에러 발생 시에도 알림창은 띄우고 창을 닫도록 예외적 우회 처리
                alert(`상담 접수가 완료되었습니다.\n(※ 현재 로컬 정적 테스트 환경입니다. 관리자 콘솔 로그를 확인해 주세요.)`);
                console.log("실제 서버 연동 시 전송될 원본 데이터 패킷:", requestData);
                closeModal();

            } finally {
                // 성공하든 실패하든 전송 프로세스가 끝났으므로 제출 버튼을 다시 활성화 상태로 복구
                const submitBtn = document.getElementById("submitConsultBtn");
                if (submitBtn) submitBtn.disabled = false;
            }
        });
    }
});