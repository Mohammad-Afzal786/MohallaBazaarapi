import express from "express";
const router = express.Router();

// Reset password redirect route
router.get("/resetpassword/:token", (req, res) => {
    const { token } = req.params;
    const appLink = `whatsappui://resetpassword/${token}`;

    res.send(`
        <html>
          <head>
            <meta http-equiv="refresh" content="0; url=${appLink}" />
          </head>
          <body>
            <p>If you are not redirected automatically, 
            <a href="${appLink}">click here</a>.</p>
          </body>
        </html>
    `);
});

export default router;