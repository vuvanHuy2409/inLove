// --- CẤU HÌNH (THAY THÔNG TIN CỦA BẠN VÀO ĐÂY) ---
const CONFIG = {
    // Vào EmailJS -> Services -> Lấy ID (Vd: service_abc123)
    SERVICE_ID: "service_36ka49n", 
    
    // Vào EmailJS -> Email Templates -> Lấy ID (Vd: template_xyz789)
    TEMPLATE_ID: "template_5um1yzi",
    
    // Vào EmailJS -> Account -> API Keys -> Lấy Public Key (Vd: user_1234abcd)
    PUBLIC_KEY: "c4xphsBudaim4VFoc"
};

// Khởi tạo EmailJS
(function() {
    emailjs.init(CONFIG.PUBLIC_KEY);
})();

// Dữ liệu câu hỏi và Gợi ý
const questionsData = [
    { q: "1. Lần đầu tiên gặp tớ, ấn tượng của cậu là gì?", hints: ["Lạnh lùng ", "Dễ thương ", "Khó gần", "Ấn tượng xấu ", "Bình thường"] },
    { q: "2. Cậu dễ bị thu hút bởi năng lượng như thế nào?", hints: ["Sôi nổi, hoạt ngôn ", "Trầm tính, tinh tế ", "Hài hước", "Thông minh"] },
    { q: "3. Có hành động nhỏ nào dễ làm cậu rung động không?", hints: ["Tập trung làm việc", "Biết nấu ăn ", "6"] },
    { q: "4. Cậu thích quà bất ngờ đắt tiền hay đồ handmade ý nghĩa?", hints: ["Đắt tiền mới thích ", "Handmade tình cảm ", "Gì cũng được", "Không quan trọng quà"] },
    { q: "5. Nếu người yêu nấu ăn dở tệ, cậu sẽ làm gì?", hints: ["Chê thẳng thừng", "Cố ăn rồi khen ngon ", "Dẫn đi ăn tiệm", "Cùng nhau nấu lại"] },
    { q: "6. Đang chơi game/làm việc mà người yêu kêu buồn, cậu sẽ...?", hints: ["Chơi xong rồi dỗ", "Dừng lại dỗ ngay ", "Kệ, đang bận mà", "Vừa chơi vừa nhắn"] },
    { q: "7. Quan điểm về bạn thân khác giới?", hints: ["Không chấp nhận ", "Bình thường mà", "Phải có giới hạn", "Tùy độ thân thiết"] },
    { q: "8. Chia sẻ mật khẩu điện thoại/Facebook?", hints: ["Thoải mái share", "Không, riêng tư mà ", "Chỉ khi cần thiết"] },
    { q: "9. Sợ cãi vã ồn ào hay sự im lặng?", hints: ["Sợ cãi nhau to", "Sợ im lặng (chiến tranh lạnh)", "Cả hai đều sợ"] },
    { q: "10. Tật xấu nào tuyệt đối không thể chịu đựng?", hints: ["Hút thuốc ", "Ở bẩn", "Trễ giờ", "Vô tâm", "Gia trưởng/Đanh đá"] },
    { q: "11. Lời nói dối nào có thể tha thứ?", hints: ["Nói dối để mình đỡ lo", "Nói dối vô hại", "Không chấp nhận dối trá"] },
    { q: "12. Nên thay đổi bản thân hay 'yêu là chấp nhận'?", hints: ["Nên thay đổi tốt hơn", "Yêu là chấp nhận hết", "Cả hai cùng sửa"] },
    { q: "13. Có ngại để người yêu thấy lúc mình yếu đuối không?", hints: ["Rất ngại ", "Thoải mái chia sẻ", "Chỉ đôi khi thôi"] },
    { q: "14. Nếu gia đình phản đối tình yêu?", hints: ["Đấu tranh đến cùng ", "Nghe theo bố mẹ", "Thuyết phục dần dần"] },
    { q: "15. Bài học lớn nhất từ quá khứ là gì?", hints: ["Yêu bản thân hơn", "Không kiểm soát", "Tin tưởng", "Giao tiếp nhiều hơn"] },
    { q: "16. Điều quan trọng nhất để duy trì quan hệ?", hints: ["Sự tin tưởng ", "Tôn trọng nhau", "Hợp chuyện", "Tài chính"] },
    { q: "17. Cậu có sẵn sàng mở lòng vào thời điểm này không?", hints: ["Sẵn sàng ", "Chưa, còn bận lắm", "Đang suy nghĩ...", "Cần tìm người phù hợp"] },
    { q: "18. Nếu tớ làm cho cậu buồn, thất vọng thì cậu có suy nghĩ gì?", hints: ["Buồn", "Thất vọng ", "Rất thất vọng","Và bỏ qua cho tớ"] },
    { q: "19. Mẫu người cậu kể nãy giờ, có thấy giống tớ không?", hints: ["Giống xíu xiu", "Giống y hệt ", "Không giống lắm", "Đang xem xét haha"] },
    { q: "20. Tớ muốn biết suy nghĩ thật lòng của cậu, về tớ, về tất cả về tớ?"}
];

// Biến trạng thái
let currentIdx = 0;
let userAnswers = new Array(questionsData.length).fill(""); 

// DOM Elements
const welcomeScreen = document.getElementById('welcome-screen');
const questionScreen = document.getElementById('question-screen');
const finishScreen = document.getElementById('finish-screen');
const loadingOverlay = document.getElementById('loading-overlay');
const qText = document.getElementById('q-text');
const hintsContainer = document.getElementById('hints-container');
const qAnswer = document.getElementById('q-answer');
const nextBtn = document.getElementById('next-btn');
const prevBtn = document.getElementById('prev-btn');
const progressBar = document.getElementById('progress-bar');
const qContent = document.getElementById('question-content');

// Bắt đầu
function startQuestions() {
    welcomeScreen.classList.add('hidden');
    questionScreen.classList.remove('hidden');
    renderQuestion();
}

// Hiển thị câu hỏi
function renderQuestion() {
    qContent.classList.remove('fade-in');
    void qContent.offsetWidth; 
    qContent.classList.add('fade-in');

    const data = questionsData[currentIdx];

    // 1. Text câu hỏi
    qText.innerText = data.q;
    
    // 2. Tạo gợi ý (Logic Mới: Chọn nhiều)
    hintsContainer.innerHTML = "";
    if (data.hints && data.hints.length > 0) {
        data.hints.forEach(hint => {
            const chip = document.createElement('div');
            chip.className = 'hint-chip';
            chip.innerText = hint;
            
            // XỬ LÝ SỰ KIỆN CLICK (Nâng cấp)
            chip.onclick = () => {
                let currentText = qAnswer.value.trim();
                
                // Kiểm tra xem gợi ý đã có trong ô chưa để tránh lặp
                if (!currentText.includes(hint)) {
                    if (currentText === "") {
                        qAnswer.value = hint;
                    } else {
                        // Thêm dấu phẩy và nối tiếp
                        qAnswer.value = currentText + ", " + hint;
                    }
                    
                    // Hiệu ứng visual nháy màu hồng khi chọn
                    chip.style.backgroundColor = "#ff758c";
                    chip.style.color = "white";
                    setTimeout(() => {
                        chip.style.backgroundColor = "";
                        chip.style.color = "";
                    }, 300);
                } else {
                    // Nếu lặp thì không làm gì (hoặc có thể báo rung)
                    console.log("Đã chọn ý này rồi");
                }
                qAnswer.focus();
            };
            hintsContainer.appendChild(chip);
        });
    }

    // 3. Điền lại câu trả lời cũ nếu có
    qAnswer.value = userAnswers[currentIdx] || "";
    qAnswer.focus();

    // 4. Xử lý nút Quay lại / Tiếp theo
    if (currentIdx === 0) {
        prevBtn.classList.add('hidden');
    } else {
        prevBtn.classList.remove('hidden');
    }

    if (currentIdx === questionsData.length - 1) {
        nextBtn.innerText = "Gửi trả lời ";
        document.querySelector('.card').style.background = "rgba(255, 245, 247, 0.95)";
        qText.style.color = "#d6336c";
    } else {
        nextBtn.innerText = "Tiếp theo ➜";
        document.querySelector('.card').style.background = "rgba(255, 255, 255, 0.95)";
        qText.style.color = "#333";
    }

    // 5. Thanh tiến trình
    const percent = ((currentIdx) / questionsData.length) * 100;
    progressBar.style.width = percent + "%";
}

// Chuyển câu tiếp theo
function nextQuestion() {
    const val = qAnswer.value.trim();
    if (!val) {
        alert("Cậu ơi, đừng để trống nha! Chọn gợi ý hoặc viết gì đó đi nè.");
        qAnswer.focus();
        return;
    }

    userAnswers[currentIdx] = val;

    if (currentIdx < questionsData.length - 1) {
        currentIdx++;
        renderQuestion();
    } else {
        sendEmail();
    }
}

// Quay lại câu trước
function prevQuestion() {
    userAnswers[currentIdx] = qAnswer.value.trim();
    if (currentIdx > 0) {
        currentIdx--;
        renderQuestion();
    }
}

// Gửi email
function sendEmail() {
    loadingOverlay.classList.remove('hidden');

    let messageBody = "";
    userAnswers.forEach((ans, index) => {
        messageBody += `❓ ${questionsData[index].q}\n💡 ${ans}\n\n`;
    });

    emailjs.send(CONFIG.SERVICE_ID, CONFIG.TEMPLATE_ID, {
        message: messageBody,
        to_name: "Crush của bạn" 
    })
    .then(() => {
        loadingOverlay.classList.add('hidden');
        questionScreen.classList.add('hidden');
        finishScreen.classList.remove('hidden');
        progressBar.style.width = "100%";
    }, (err) => {
        loadingOverlay.classList.add('hidden');
        alert("Lỗi gửi thư rồi: " + JSON.stringify(err));
    });
}

// Enter để Next
qAnswer.addEventListener("keypress", function(event) {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        nextQuestion();
    }
});
