<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://w3.org" xmlns:os="http://a9.com">
    <xsl:output method="html" encoding="UTF-8" doctype-public="-//W3C//DTD HTML 4.01//EN"/>
    <xsl:template match="os:OpenSearchDescription">
        <html>
            <head>
                <title>Search Provider: <xsl:value-of select="os:ShortName"/></title>
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; background: #f8f9fa; color: #202124; padding: 40px; margin: 0; }
                    .card { background: #ffffff; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); border-top: 5px solid #3366cc; }
                    h1 { color: #3366cc; margin-top: 0; font-size: 24px; }
                    p { font-size: 15px; line-height: 1.6; color: #5f6368; }
                    .badge { display: inline-block; background: #e8f0fe; color: #1a73e8; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="card">
                    <h1><xsl:value-of select="os:ShortName"/> Search Integration</h1>
                    <p><xsl:value-of select="os:Description"/></p>
                    <p>To use this, simply type <strong>wikiforms.toolforge.org</strong> in your browser's address bar, press <strong>Tab</strong> or <strong>Space</strong>, and start typing your search query.</p>
                    <span class="badge">OpenSearch 1.1 Enabled</span>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
