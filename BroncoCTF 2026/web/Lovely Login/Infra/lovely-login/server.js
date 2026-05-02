const express = require("express");
const app = express();
const FLAG = process.env.FLAG;

app.use(express.json());

const users = ["jeff", "sarah", "admin", "guest"];

const userGifs = {
  jeff: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExdmFhanlxMjd4b2gzN2JxNzNpb2gxYTJlbGF0djcxb3BseXhhOXpoeiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/P5DHSQJhK5qLfLzLI2/giphy.gif",
  sarah: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXA5eHQyOHBtMWpqYWc1ZGR6aXUzeXpmd3B3NDY0ODEzN2VtcW9vNSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/UCuihHFMbJFXa/giphy.gif",
  guest: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExYTI3NWdsb281bnczMXpwNHh2M2RoaGI2czM1Y2t5NXc3dzMweGo4NiZlcD12MV9naWZzX3NlYXJjaCZjdD1n/l0MYC0LajbaPoEADu/giphy.gif",
  admin: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNjNyNmp6dWpycnliN3pycDQwOGhtNGgwbHc5Zm9la3VoejVydDBuNCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/SVCSsoKU5v6ZJLk07n/giphy.gif"
};

app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Lovely Login</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont;
      background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
      color: #e8f1f5;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0;
    }

    .card {
      background: rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
      border-radius: 16px;
      padding: 30px;
      width: 320px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.3);
      text-align: center;
    }

    h1 {
      margin-top: 0;
      font-size: 1.6rem;
      margin-bottom: 20px;
    }

    input {
      width: 100%;
      padding: 10px;
      margin: 8px 0;
      border-radius: 8px;
      border: none;
      outline: none;
      font-size: 1rem;
    }

    button {
      margin-top: 12px;
      width: 100%;
      padding: 10px;
      border-radius: 8px;
      border: none;
      background: #4fc3f7;
      color: #003344;
      font-weight: bold;
      cursor: pointer;
      font-size: 1rem;
    }

    button:hover {
      background: #81d4fa;
    }

    #out {
      margin-top: 20px;
    }

    img {
      border-radius: 12px;
      margin-top: 10px;
      max-width: 100%;
    }

    pre {
      background: rgba(0,0,0,0.4);
      padding: 10px;
      border-radius: 8px;
      overflow-x: auto;
    }
  </style>
</head>
<body>

  <div class="card">
    <h1>Secure Database</h1>

    <input id="u" placeholder="Username">
    <input id="p" placeholder="Password" type="password">
    <button onclick="login()">Login</button>

    <div id="out"></div>
  </div>

  <script>
    async function login() {
      const u = document.getElementById("u").value;
      const p = document.getElementById("p").value;

      const res = await fetch("/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({username: u, password: p})
      });

      document.getElementById("out").innerHTML = await res.text();
    }
  </script>

</body>
</html>
`);
});


app.get("/security", (req, res) => {
  res.send(`
    <h1>Internal Security Notes</h1>

    <p><b>Status:</b> Work in progress</p>

    <ul>
      <li>Passwords are derived from usernames</li>
      <li>Current implementation stores them backwards for obfuscation</li>
      <li>Planned upgrade: hashing + salting</li>
    </ul>

    <p style="color:black;">
      <b>TODO:</b> remove this page before production deployment!
    </p>
  `);
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(
`User-agent: *
Disallow: /security

# amVmZixzYXJhaCx hZG1pbixndWVzdA==
`
  );
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!users.includes(username)) {
    return res.send("No such user");
  }

  if (password === username.split("").reverse().join("")) {
  const gif = userGifs[username];

  // Admin gets the flag
  if (username === "admin") {
    return res.send(`
      <h2>Welcome, admin.</h2>
      <img src="${gif}" style="max-width:300px;"><br>
      <pre>${FLAG}</pre>
    `);
  }

  // Everyone else just gets their GIF!
  return res.send(`
    <h2>Welcome, ${username}!</h2>
    <img src="${gif}" style="max-width:300px;">
  `);
  }
  res.send("Wrong password");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
