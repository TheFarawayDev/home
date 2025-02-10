    const authModal = document.getElementById('authModal');
    const jsonUrl = 'https://raw.githubusercontent.com/Better-Anime/home/refs/heads/main/users.json'; // Replace with your JSON URL

    async function authenticateUser() {
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch(jsonUrl);
        if (!response.ok) throw new Error('Failed to fetch credentials.');
        const credentials = await response.json();

        if (credentials[username] === password) {
          authModal.style.display = 'none';
        } else {
          alert('Invalid credentials! Closing Site...');
          window.close(); // Close the site if credentials are wrong
        }
      } catch (error) {
        console.error('Authentication error:', error);
      }
    }