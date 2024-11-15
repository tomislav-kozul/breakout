function formatCreditCardNumber(credit_card_number) {
    const formated_number = credit_card_number.replace(/\D/g, '');
    return formated_number.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiryDate(expiry_date) {
    const date = new Date(expiry_date);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${year}`;
}

function submitFunctionCaptcha(login_form, has_checkbox) {
    document.getElementById(login_form).addEventListener('submit', async function(event) {
        event.preventDefault();

        const formElement = document.getElementById(login_form);

        document.querySelector('.response').classList.add('no-show');
        document.querySelector('.error').classList.add('no-show');
        document.querySelector('.generating-text').classList.remove('no-show');

        const username_input = formElement.querySelector('#username_input').value;
        const password_input = formElement.querySelector('#password_input').value;

        var injection_checkbox;
        if (has_checkbox == true) {
            injection_checkbox = formElement.querySelector('#allow-inject').checked;
        } else {
            injection_checkbox = false;
        }
        

        try {
            document.getElementById("g-recaptcha-response").value = grecaptcha.getResponse();
            //console.log("value -> ", document.getElementById("g-recaptcha-response").value)
            const captcha_response = document.getElementById("g-recaptcha-response").value;
            if (!captcha_response) {
                throw new Error("'CAPTCHA' test is required");
            }

            //const captcha_response = document.getElementById("g-recaptcha-response").value;

            const reqBody = {
                username: username_input,
                password: password_input,
                injection: injection_checkbox,
                captcha_response: captcha_response
            };
    
            const response = await fetch('/api/login-challenge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
            });
    
            if (response.status !== 200) {
                const errorData = await response.json();
                throw new Error(errorData.message || response.statusText);
            }
    
            console.log(response)
            const userData = await response.json();
    
            console.log(userData.data);
    
            const tableBody = document.querySelector('#creditDataTable tbody');
            tableBody.innerHTML = '';
    
            userData.data.forEach(item => {
                const row = document.createElement('tr');

                const firstNameCell = document.createElement('td');
                firstNameCell.textContent = item.first_name;
                row.appendChild(firstNameCell);

                const lastNameCell = document.createElement('td');
                lastNameCell.textContent = item.last_name;
                row.appendChild(lastNameCell);
                
                const cardNumberCell = document.createElement('td');
                cardNumberCell.textContent = formatCreditCardNumber(item.card_number);
                row.appendChild(cardNumberCell);

                const expiryDateCell = document.createElement('td');
                expiryDateCell.textContent = formatExpiryDate(item.expiry_date);
                row.appendChild(expiryDateCell);

                const cvvCell = document.createElement('td');
                cvvCell.textContent = item.cvv;
                row.appendChild(cvvCell);

                const balanceCell = document.createElement('td');
                balanceCell.textContent = '$' + item.balance;
                row.appendChild(balanceCell);

                tableBody.appendChild(row);
            });

            document.getElementById('response-username').innerText = username_input;

            document.querySelector('.response').classList.remove('no-show');
            document.querySelector('.error').classList.add('no-show');
            document.querySelector('.generating-text').classList.add('no-show');
        } catch (err) {
            document.querySelector('.response').classList.add('no-show');
            document.querySelector('.error').classList.remove('no-show');
            document.querySelector('.generating-text').classList.add('no-show');

            if (err.response && err.response.data && err.response.data.error) {
                document.getElementById('error-text').innerText = err.response.data.error;
            } else {
                document.getElementById('error-text').innerText = err.message || 'An unexpected error occurred';
            }
        }

        grecaptcha.reset();
        document.getElementById('response-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        return
    });
}

function setCaptchaResponse(token) {
    document.getElementById("g-recaptcha-response").value = token;
}


function submitFunction(login_form, has_checkbox) {
    document.getElementById(login_form).addEventListener('submit', async function(event) {
        event.preventDefault();

        const formElement = document.getElementById(login_form);

        document.querySelector('.response').classList.add('no-show');
        document.querySelector('.error').classList.add('no-show');
        document.querySelector('.generating-text').classList.remove('no-show');

        const username_input = formElement.querySelector('#username_input').value;
        const password_input = formElement.querySelector('#password_input').value;

        var injection_checkbox;
        if (has_checkbox == true) {
            injection_checkbox = formElement.querySelector('#allow-inject').checked;
        } else {
            injection_checkbox = false;
        }
        

        try {
            const reqBody = {
                username: username_input,
                password: password_input,
                injection: injection_checkbox
            };
    
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(reqBody),
            });
    
            if (response.status !== 200) {
                const errorData = await response.json();
                throw new Error(errorData.message || response.statusText);
            }
    
            console.log(response)
            const userData = await response.json();
    
            console.log(userData.data);
    
            const tableBody = document.querySelector('#creditDataTable tbody');
            tableBody.innerHTML = '';
    
            userData.data.forEach(item => {
                const row = document.createElement('tr');

                const firstNameCell = document.createElement('td');
                firstNameCell.textContent = item.first_name;
                row.appendChild(firstNameCell);

                const lastNameCell = document.createElement('td');
                lastNameCell.textContent = item.last_name;
                row.appendChild(lastNameCell);
                
                const cardNumberCell = document.createElement('td');
                cardNumberCell.textContent = formatCreditCardNumber(item.card_number);
                row.appendChild(cardNumberCell);

                const expiryDateCell = document.createElement('td');
                expiryDateCell.textContent = formatExpiryDate(item.expiry_date);
                row.appendChild(expiryDateCell);

                const cvvCell = document.createElement('td');
                cvvCell.textContent = item.cvv;
                row.appendChild(cvvCell);

                const balanceCell = document.createElement('td');
                balanceCell.textContent = '$' + item.balance;
                row.appendChild(balanceCell);

                tableBody.appendChild(row);
            });

            document.getElementById('response-username').innerText = username_input;

            document.querySelector('.response').classList.remove('no-show');
            document.querySelector('.error').classList.add('no-show');
            document.querySelector('.generating-text').classList.add('no-show');
        } catch (err) {
            document.querySelector('.response').classList.add('no-show');
            document.querySelector('.error').classList.remove('no-show');
            document.querySelector('.generating-text').classList.add('no-show');

            if (err.response && err.response.data && err.response.data.error) {
                document.getElementById('error-text').innerText = err.response.data.error;
            } else {
                document.getElementById('error-text').innerText = err.message || 'An unexpected error occurred';
            }
        }

        document.getElementById('response-section').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        return
    });
}

function enableCaptcha(){
    document.querySelector('.input-no-captcha').classList.add('no-show');
    document.querySelector('.enable-captcha-button').classList.add('no-show');
    document.querySelector('.input-captcha').classList.remove('no-show');
    document.querySelector('.disable-captcha-button').classList.remove('no-show');
}

function disableCaptcha(){
    document.querySelector('.input-no-captcha').classList.remove('no-show');
    document.querySelector('.enable-captcha-button').classList.remove('no-show');
    document.querySelector('.input-captcha').classList.add('no-show');
    document.querySelector('.disable-captcha-button').classList.add('no-show');
}

window.onload = function() {
    submitFunction('loginForm', true);
    submitFunction('loginFormNoCaptcha', false);
    submitFunctionCaptcha('loginFormCaptcha', false);
}