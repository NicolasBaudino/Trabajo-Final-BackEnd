// const form = document.getElementById("registerForm");

// form.addEventListener('submit', e =>{
//     e.preventDefault()
//     const data = new FormData(form)
//     const obj = {}
//     data.forEach((value,key)=>obj[key]=value)
//     fetch('/api/jwt/register', {
//         method:"POST",
//         body: JSON.stringify(obj),
//         headers:{
//             'Content-Type': 'application/json'
//         }
//     })
//     .then(result =>{
//         if(result.status === 200){
//             window.location.replace("/users/login")
//         }
//     })
// })


const form = document.getElementById("registerForm");

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = new FormData(form);

    fetch('/api/jwt/register', {
        method: "POST",
        body: formData, // enviar directamente FormData
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            window.location.replace("/users/login");
        } else {
            alert(data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Failed to register. See console for details.");
    });
});