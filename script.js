document.getElementById('prepare-button').onclick = function() {
    const player1Name = document.getElementById('player1-name').value;
    const player2Name = document.getElementById('player2-name').value;

    const player1Image = document.getElementById('player1-image').files[0];
    const player2Image = document.getElementById('player2-image').files[0];
    const backgroundImage = document.getElementById('background-image').files[0];

    const resultDisplay = document.getElementById('result-display');
    resultDisplay.innerHTML = '';

    // تغيير خلفية الصفحة إذا كانت صورة مدخلة
    if (backgroundImage) {
        const backgroundUrl = URL.createObjectURL(backgroundImage);
        document.body.style.backgroundImage = `url('${backgroundUrl}')`;
        document.body.style.backgroundSize = 'cover';
    }

    const namesContainer = document.createElement('div');
    namesContainer.className = 'names-container';
    namesContainer.innerHTML = `
        <div>
            <img src="${URL.createObjectURL(player1Image)}" alt="${player1Name}" style="max-width: 100px; max-height: 100px;">
            <h4>${player1Name}</h4>
            <span class="player-total" id="player1-total"></span>
        </div>
        <div>
            <img src="${URL.createObjectURL(player2Image)}" alt="${player2Name}" style="max-width: 100px; max-height: 100px;">
            <h4>${player2Name}</h4>
            <span class="player-total" id="player2-total"></span>
        </div>
    `;
    resultDisplay.appendChild(namesContainer);

    const compareButton = document.createElement('button');
    compareButton.className = 'compare-button';
    compareButton.textContent = 'بدء المقارنة';
    compareButton.onclick = startComparison;
    resultDisplay.appendChild(compareButton);
};

function startComparison() {
    const resultDisplay = document.getElementById('result-display');
    const compareButton = document.querySelector('.compare-button');
    compareButton.style.display = 'none';

    const loadingImage = document.createElement('img');
    loadingImage.src = 'loading.png';
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
                // حساب المجموع بعد الانتهاء من جميع أشرطة التقدم
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
    return Math.round(total / rows.length); // احتساب المجموع كنسبة مئوية
}

function displayPlayerTotal(elementId, total) {
    const element = document.getElementById(elementId);
    element.classList.remove('show'); // إزالة الفئة show قبل بدء العد
    let current = 0;
    const interval = setInterval(() => {
        if (current < total) {
            current++;
            element.textContent = `${current}%`; // عرض العدد كنسبة مئوية
        } else {
            clearInterval(interval);
        }
    }, 20);
    
    // إضافة تأثير النمو عند عرض المجموع النهائي
    setTimeout(() => {
        element.classList.add('show'); // إضافة فئة show لإظهار التأثير
    }, 10); // تأخير بسيط لجعل التأثير يبدو سلسًا
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// إدارة إضافة صفوف وحذفها
document.getElementById('add-item-button').onclick = function() {
    const tbody = document.querySelector('tbody');
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" placeholder="اسم البند"></td>
        <td><input type="text" placeholder="نسبة اللاعب الأول (مثال: 80%)"></td>
        <td><input type="text" placeholder="نسبة اللاعب الثاني (مثال: 65%)"></td>
        <td class="handle">⇅</td>
        <td><button class="delete-button">X</button></td>
    `;
    tbody.appendChild(newRow);

    // إضافة حدث لحذف الصف الجديد
    newRow.querySelector('.delete-button').onclick = function() {
        newRow.remove();
    };
};

// إضافة أحداث الحذف لكل الأزرار الحالية
document.querySelectorAll('.delete-button').forEach(button => {
    button.onclick = function() {
        button.closest('tr').remove();
    };
});

// تحميل بيانات من ملف CSV
document.getElementById('upload-button').onclick = function() {
    const fileInput = document.getElementById('csv-file');
    const file = fileInput.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const content = event.target.result;
            const rows = content.split('\n'); // تقسيم البيانات إلى صفوف

            // إفراغ الجدول قبل إضافة بيانات جديدة
            const tbody = document.querySelector('tbody');
            tbody.innerHTML = '';

            rows.forEach(row => {
                const columns = row.split(','); // تقسيم الصف إلى أعمدة
                if (columns.length === 3) { // التأكد من وجود 3 أعمدة
                    const newRow = document.createElement('tr');
                    newRow.setAttribute('draggable', 'true'); // تعيين draggable لكل صف جديد
                    newRow.innerHTML = `
                        <td><input type="text" value="${columns[0].trim()}" placeholder="اسم البند"></td>
                        <td><input type="text" value="${columns[1].trim()}" placeholder="نسبة اللاعب الأول (مثال: 80%)"></td>
                        <td><input type="text" value="${columns[2].trim()}" placeholder="نسبة اللاعب الثاني (مثال: 65%)"></td>
                        <td class="handle">⇅</td> <!-- تأكد من وجود عنصر التحريك هنا -->
                        <td><button class="delete-button">X</button></td>
                    `;
                    tbody.appendChild(newRow);

                    // إضافة حدث لحذف الصف الجديد
                    newRow.querySelector('.delete-button').onclick = function() {
                        newRow.remove();
                    };

                    // تفعيل السحب والإفلات للصف الجديد
                    newRow.addEventListener('dragstart', () => {
                        draggedRow = newRow;
                        newRow.classList.add('dragging');
                    });

                    newRow.addEventListener('dragend', () => {
                        draggedRow = null;
                        newRow.classList.remove('dragging');
                    });

                    newRow.addEventListener('dragover', (e) => {
                        e.preventDefault();
                        if (newRow !== draggedRow) {
                            const bounding = newRow.getBoundingClientRect();
                            const offset = bounding.y + bounding.height / 2;
                            if (e.clientY - offset > 0) {
                                newRow.style.borderBottom = '2px solid #000';
                                newRow.style.borderTop = '';
                            } else {
                                newRow.style.borderTop = '2px solid #000';
                                newRow.style.borderBottom = '';
                            }
                        }
                    });

                    newRow.addEventListener('dragleave', () => {
                        newRow.style.borderTop = '';
                        newRow.style.borderBottom = '';
                    });

                    newRow.addEventListener('drop', () => {
                        if (newRow !== draggedRow) {
                            newRow.style.borderTop = '';
                            newRow.style.borderBottom = '';
                            if (draggedRow) {
                                const tbody = newRow.parentNode;
                                tbody.insertBefore(draggedRow, newRow.nextSibling);
                            }
                        }
                    });
                }
            });
        };
        reader.readAsText(file);
    }
};
