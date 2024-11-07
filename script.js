// تهيئة زر "تحضير النتائج"
document.getElementById('prepare-button').onclick = function() {
    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;
    const player1Image = document.getElementById('player1-image').files[0];
    const player2Image = document.getElementById('player2-image').files[0];
    const backgroundImage = document.getElementById('background-image').files[0];
    const resultDisplay = document.getElementById('result-display');
    resultDisplay.innerHTML = '';

    // تعيين خلفية القسم الأيمن فقط
    if (backgroundImage) {
        const backgroundUrl = URL.createObjectURL(backgroundImage);
        document.querySelector('.right-section').style.backgroundImage = `url('${backgroundUrl}')`;
        document.querySelector('.right-section').style.backgroundSize = 'cover';
    }

    // عرض صور وأسماء اللاعبين
    const namesContainer = document.createElement('div');
    namesContainer.className = 'names-container';
    namesContainer.innerHTML = `
        <div>
            <img src="${player1Image ? URL.createObjectURL(player1Image) : ''}" alt="${player1Name}" style="max-width: 100px; max-height: 100px;">
            <h4>${player1Name}</h4>
            <span class="player-total" id="player1-total"></span>
        </div>
        <div>
            <img src="${player2Image ? URL.createObjectURL(player2Image) : ''}" alt="${player2Name}" style="max-width: 100px; max-height: 100px;">
            <h4>${player2Name}</h4>
            <span class="player-total" id="player2-total"></span>
        </div>
    `;
    resultDisplay.appendChild(namesContainer);

    // إضافة زر "بدء المقارنة"
    const compareButton = document.createElement('button');
    compareButton.className = 'compare-button';
    compareButton.textContent = 'بدء المقارنة';
    compareButton.onclick = startComparison; // ربط الزر بالدالة لبدء المقارنة
    resultDisplay.appendChild(compareButton);
};

// دالة لبدء المقارنة
function startComparison() {
    const resultDisplay = document.getElementById('result-display');
    const compareButton = document.querySelector('.compare-button');
    compareButton.style.display = 'none';

    const loadingImage = document.createElement('img');
    loadingImage.src = 'loading.png'; // تأكد من وجود صورة التحميل في المجلد
    loadingImage.alt = 'Loading';
    loadingImage.className = 'loading-image';
    resultDisplay.appendChild(loadingImage);

    setTimeout(() => {
        resultDisplay.removeChild(loadingImage);
        const rows = document.querySelectorAll('tbody tr');
        let index = 0;

        const fillProgressBar = () => {
            if (index < rows.length) {
                const row = rows[index];
                const item = row.children[0].querySelector('input').value;
                const player1Score = row.children[1].querySelector('input').value;
                const player2Score = row.children[2].querySelector('input').value;
                const player1NumericScore = parseFloat(player1Score.replace('%', '')) || 0;
                const player2NumericScore = parseFloat(player2Score.replace('%', '')) || 0;

                const totalScore = player1NumericScore + player2NumericScore;
                const player1Percentage = totalScore > 0 ? (player1NumericScore / totalScore) * 100 : 0;
                const player2Percentage = totalScore > 0 ? (player2NumericScore / totalScore) * 100 : 0;

                if (item && !isNaN(player1NumericScore) && !isNaN(player2NumericScore)) {
                    const progressContainer = document.createElement('div');
                    progressContainer.className = 'progress-container';

                    const itemHeader = document.createElement('div');
                    itemHeader.className = 'progress-item';
                    itemHeader.innerHTML = `
                        <div class="progress-label">${item}</div>
                        <div class="combined-progress-bar">
                            <div class="player1-progress" style="width: ${player1Percentage}%; background-color: ${getRandomColor()};"><span class="progress-text">${player1Score}</span></div>
                            <div class="player2-progress" style="width: ${player2Percentage}%; background-color: ${getRandomColor()};"><span class="progress-text">${player2Score}</span></div>
                        </div>
                    `;

                    progressContainer.appendChild(itemHeader);
                    resultDisplay.insertBefore(progressContainer, resultDisplay.children[1]);

                    let current1 = 0, current2 = 0;
                    const interval = setInterval(() => {
                        if (current1 < player1NumericScore) {
                            current1++;
                            itemHeader.querySelector('.player1-progress').style.width = `${(current1 / totalScore) * 100}%`;
                            itemHeader.querySelector('.player1-progress .progress-text').textContent = `${Math.round(current1)}${player1Score.includes('%') ? '%' : ''}`;
                        }
                        if (current2 < player2NumericScore) {
                            current2++;
                            itemHeader.querySelector('.player2-progress').style.width = `${(current2 / totalScore) * 100}%`;
                            itemHeader.querySelector('.player2-progress .progress-text').textContent = `${Math.round(current2)}${player2Score.includes('%') ? '%' : ''}`;
                        }

                        if (current1 >= player1NumericScore && current2 >= player2NumericScore) {
                            clearInterval(interval);
                            index++;
                            setTimeout(fillProgressBar, 1000);
                        }
                    }, 20);
                } else {
                    index++;
                    fillProgressBar();
                }
            } else {
                const totalPlayer1 = calculateTotalScore(1);
                const totalPlayer2 = calculateTotalScore(2);
                displayPlayerTotal('player1-total', totalPlayer1);
                displayPlayerTotal('player2-total', totalPlayer2);
            }
        };

        fillProgressBar();
    }, 3000);
}

// دالة لحساب المجموع
function calculateTotalScore(playerIndex) {
    const rows = document.querySelectorAll('tbody tr');
    let total = 0;
    rows.forEach(row => {
        const score = row.children[playerIndex].querySelector('input').value;
        total += parseFloat(score.replace('%', '')) || 0;
    });
    return Math.round(total / rows.length);
}

// عرض المجموع النهائي
function displayPlayerTotal(elementId, total) {
    const element = document.getElementById(elementId);
    element.classList.remove('show');
    let current = 0;
    const interval = setInterval(() => {
        if (current < total) {
            current++;
            element.textContent = `${current}%`;
        } else {
            clearInterval(interval);
        }
    }, 20);

    setTimeout(() => {
        element.classList.add('show');
    }, 10);
}
document.getElementById('compare-left-button').onclick = startComparison;


// دالة لتوليد لون عشوائي
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// إضافة وإدارة صفوف الجدول
document.getElementById('add-item-button').onclick = function() {
    const tbody = document.querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.setAttribute('draggable', 'true'); // تعيين draggable لكل صف جديد
    newRow.innerHTML = `
        <td><input type="text" placeholder="اسم البند"></td>
        <td><input type="text" placeholder="نسبة اللاعب الأول (مثال: 80%)"></td>
        <td><input type="text" placeholder="نسبة اللاعب الثاني (مثال: 65%)"></td>
        <td class="handle">⇅</td>
        <td><button class="delete-button">X</button></td>
    `;
    tbody.appendChild(newRow);

    // إضافة أحداث السحب والإفلات للصف الجديد
    newRow.addEventListener('dragstart', dragStart);
    newRow.addEventListener('dragover', dragOver);
    newRow.addEventListener('drop', drop);

    newRow.querySelector('.delete-button').onclick = function() {
        newRow.remove();
    };
};

// دالة تحميل بيانات من ملف CSV
document.getElementById('upload-button').onclick = function() {
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];
    if (!file) {
        alert('يرجى اختيار ملف CSV');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        const contents = event.target.result;
        const rows = contents.split('\n');
        const tbody = document.querySelector('tbody');
        tbody.innerHTML = ''; // مسح الجدول الحالي
        rows.forEach(row => {
            const columns = row.split(',');
            if (columns.length >= 3) { // التأكد من وجود 3 أعمدة على الأقل
                const newRow = document.createElement('tr');
                newRow.setAttribute('draggable', 'true'); // تعيين draggable لكل صف جديد
                newRow.innerHTML = `
                    <td><input type="text" value="${columns[0].trim()}" placeholder="اسم البند"></td>
                    <td><input type="text" value="${columns[1].trim()}" placeholder="نسبة اللاعب الأول (مثال: 80%)"></td>
                    <td><input type="text" value="${columns[2].trim()}" placeholder="نسبة اللاعب الثاني (مثال: 65%)"></td>
                    <td class="handle">⇅</td>
                    <td><button class="delete-button">X</button></td>
                `;
                tbody.appendChild(newRow);

                // إضافة أحداث السحب والإفلات للصف الجديد
                newRow.addEventListener('dragstart', dragStart);
                newRow.addEventListener('dragover', dragOver);
                newRow.addEventListener('drop', drop);

                newRow.querySelector('.delete-button').onclick = function() {
                    newRow.remove();
                };
            }
        });
    };

    reader.readAsText(file);
};

// وظيفة السحب والإفلات
const rows = document.querySelectorAll('tbody tr');
rows.forEach(row => {
    row.addEventListener('dragstart', dragStart);
    row.addEventListener('dragover', dragOver);
    row.addEventListener('drop', drop);
});

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.outerHTML); // حفظ محتوى الصف المنقول
    event.target.classList.add('dragging'); // إضافة كلاس للمؤشر أثناء السحب
}

function dragOver(event) {
    event.preventDefault(); // منع السلوك الافتراضي لتمكين السحب والإفلات
}

function drop(event) {
    event.preventDefault(); // منع السلوك الافتراضي
    const draggingRow = document.querySelector('.dragging'); // تحديد الصف المنقول
    const targetRow = event.target.closest('tr'); // تحديد الصف الهدف
    if (targetRow && targetRow !== draggingRow) {
        targetRow.insertAdjacentHTML('beforebegin', draggingRow.outerHTML); // إدراج الصف المنقول قبل الصف الهدف
        draggingRow.remove(); // حذف الصف المنقول من موقعه القديم
    }
}

// إضافة أحداث السحب والإفلات للصفوف الحالية
const existingRows = document.querySelectorAll('tbody tr');
existingRows.forEach(row => {
    row.addEventListener('dragstart', dragStart);
    row.addEventListener('dragover', dragOver);
    row.addEventListener('drop', drop);
});
