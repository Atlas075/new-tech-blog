const signupFormHandler = async function(event) {
  event.preventDefault();

  const username = document.querySelector("#username-signup").value.trim();
  const email = document.querySelector("#email-signup").value.trim();
  const password = document.querySelector("#password-signup").value.trim();


if (username && email && password) {
  const response = await fetch('/api/user/signup', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password,
      email
    }),
    headers: { 'Content-Type': 'application/json' },
  });
console.log('hatefbatenbshg')
  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert('Failed to sign up');
  }}
};

document
  .querySelector('.signup-form')
  .addEventListener('submit', signupFormHandler);
