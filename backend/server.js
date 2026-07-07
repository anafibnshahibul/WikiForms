const express = require('express');
const session = require('express-session');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

const WIKI_CLIENT_ID = process.env.WIKI_CLIENT_ID || 'YOUR_BACKUP_CLIENT_ID'; 
const WIKI_CLIENT_SECRET = process.env.WIKI_CLIENT_SECRET || 'YOUR_BACKUP_CLIENT_SECRET';
const CALLBACK_URL = 'https://wikiforms.toolforge.org/api/auth/mediawiki/callback';

app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'wikiforms-super-secret-session-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/auth/mediawiki', (req, res) => {
  const oauthState = Math.random().toString(36).substring(2);
  req.session.oauthState = oauthState;

  const authUrl = `https://meta.wikimedia.org/w/rest.php/oauth2/authorize?` +
    `client_id=${WIKI_CLIENT_ID}&` +
    `response_type=code&` +
    `state=${oauthState}`;

  res.redirect(authUrl);
});

app.get('/api/auth/mediawiki/callback', async (req, res) => {
  const { code, state } = req.query;

  if (!state || state !== req.session.oauthState) {
    return res.status(403).send('🔐 Security Breach: Invalid OAuth State Token');
  }

  try {
    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'WikiForms/1.2.0 (https://wikiforms.toolforge.org; anaf@example.com)'
      }
    };

    const tokenResponse = await axios.post(
      'https://meta.wikimedia.org/w/rest.php/oauth2/access_token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: WIKI_CLIENT_ID,
        client_secret: WIKI_CLIENT_SECRET,
        redirect_uri: CALLBACK_URL
      }),
      config
    );

    const accessToken = tokenResponse.data.access_token;

    const profileResponse = await axios.get(
      'https://meta.wikimedia.org/w/rest.php/oauth2/resource/profile',
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'User-Agent': 'WikiForms/1.2.0 (https://wikiforms.toolforge.org)'
        }
      }
    );

    const wikiProfile = profileResponse.data;

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Successful</title>
          <style>
            body { font-family: sans-serif; text-align: center; background: #f8f9fa; padding-top: 60px; }
            .card { background: white; padding: 30px; display: inline-block; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .logo { width: 80px; height: 80px; object-fit: contain; margin-bottom: 15px; }
            h3 { color: #00af89; margin: 10px 0; }
            p { color: #54595d; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="card">
            <img class="logo" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Wikipedia-logo-v2-en.svg/1200px-Wikipedia-logo-v2-en.svg.png" alt="Wiki Logo" />
            <h3>✓ Authorization Successful!</h3>
            <p>Syncing secure credentials with WikiForms workspace...</p>
          </div>

          <script>
            const userData = {
              username: ${JSON.stringify(wikiProfile.username)}
            };
            
            window.opener.postMessage(
              { type: 'WIKI_AUTH_SUCCESS', user: userData }, 
              window.location.origin
            );

            setTimeout(() => {
              window.close();
            }, 2000);
          </script>
        </body>
      </html>
    `);

  } catch (error) {
    console.error('OAuth Execution Error:', error.response ? error.response.data : error.message);
    res.status(500).send('❌ MediaWiki OAuth 2.0 handshake failed.');
  }
});

app.post('/api/save-form', (req, res) => {
  res.json({ success: true, message: 'Saved to mock database server node' });
});

app.get('/api/get-form/:slug', (req, res) => {
  res.json({ id: req.params.slug, title: "Database Sync Connected" });
});

app.listen(PORT, () => {
  console.log(`🚀 WikiForms Active Core Server running on port ${PORT}`);
});