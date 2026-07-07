<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>

  <xsl:template match="/">
    <html>
      <head>
        <title>WikiForms XML Sitemap</title>
        <style> 
          body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            background: #f0f4f8; 
            color: #2d3748; 
            padding: 40px 20px; 
            margin: 0;
            display: flex;
            justify-content: center;
          } 
          .sitemap-container {
            max-width: 1000px;
            width: 100%;
          }
          h1 { 
            color: rgb(51, 102, 204); 
            margin-bottom: 5px;
            font-size: 28px;
          } 
          p {
            color: #718096;
            margin-top: 0;
            margin-bottom: 25px;
            font-size: 14px;
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            background: #ffffff; 
            border-radius: 8px; 
            overflow: hidden; 
            box-shadow: 0 4px 15px rgba(51, 102, 204, 0.1); 
          } 
          th { 
            background: rgb(51, 102, 204); 
            color: #ffffff; 
            text-align: left; 
            padding: 15px; 
            font-weight: 600;
            font-size: 15px;
            letter-spacing: 0.5px;
          } 
          td { 
            padding: 14px 15px; 
            border-bottom: 1px solid #e2e8f0; 
            font-size: 14px;
            word-break: break-all;
          } 
          tr:hover { 
            background: rgba(51, 102, 204, 0.05); /* হালকা নীলের হোভার ইফেক্ট */
          } 
          a { 
            color: rgb(51, 102, 204); 
            text-decoration: none; 
            font-weight: 500;
          } 
          a:hover { 
            text-decoration: underline; 
          } 
          .priority { 
            font-weight: bold; 
            color: #2ecc71; 
            background: #e8f8f0;
            padding: 4px 8px;
            border-radius: 4px;
            display: inline-block;
          } 
          .lastmod {
            color: #4a5568;
          }
        </style>
      </head>
      <body>
        <div class="sitemap-container">
          <h1>WikiForms XML Sitemap</h1>
          <p>This is an XML sitemap for SEO purposes.</p>
          <table>
            <tr>
              <th>URL / Location</th>
              <th style="width: 120px;">Priority</th>
              <th style="width: 200px;">Last Modified</th>
            </tr>
            <xsl:for-each select="sitemap:urlset/sitemap:url">
              <tr>
                <td>
                  <a href="{sitemap:loc}" target="_blank">
                    <xsl:value-of select="sitemap:loc"/>
                  </a>
                </td>
                <td>
                  <span class="priority">
                    <xsl:value-of select="sitemap:priority"/>
                  </span>
                </td>
                <td class="lastmod">
                  <xsl:value-of select="sitemap:lastmod"/>
                </td>
              </tr>
            </xsl:for-each>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>