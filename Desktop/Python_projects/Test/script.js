export let username = null
export let email = null

document.getElementById('LogInForm').addEventListener('submit', async (e) => {
    e.preventDefault()

    const formData = {
        email: e.target.email.value,
        pass: e.target.password.value
    }

    const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })

    if (!response.ok) {
        alert(`${response.status}`)
        alert('An error detected')
    }

    const data = await response.json()
    if (data.error) {
        alert(data.error)
        return
    }
    username = data.name
    email = data.email
    window.location.href = 'home.html'
})