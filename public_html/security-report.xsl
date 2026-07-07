<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://w3.org">
    <xsl:output method="html" encoding="UTF-8"/>
    <xsl:template match="/securityAudit">
        <html>
            <head>
                <title><xsl:value-of select="@system"/> - Security Ledger</title>
                <style>
                    body { font-family: monospace; background: #0d1117; color: #c9d1d9; padding: 40px; }
                    .panel { max-width: 700px; margin: 0 auto; background: #161b22; padding: 25px; border-radius: 6px; border: 1px solid #30363d; }
                    .status-banner { padding: 10px; border-radius: 4px; font-weight: bold; text-align: center; margin-bottom: 20px; }
                    .compliant { background: rgba(46,160,67,0.15); color: #3fb950; border: 1px solid rgba(46,160,67,0.4); }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #21262d; }
                    th { color: #8b949e; font-size: 12px; text-transform: uppercase; }
                    .badge { background: #30363d; padding: 2px 6px; border-radius: 3px; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="panel">
                    <h2><xsl:value-of select="@system"/> Security Assessment</h2>
                    <p style="color:#8b949e; font-size:12px;">Generated: <xsl:value-of select="@generationTime"/></p>
                    <div class="status-banner compliant">
                        System Status: <xsl:value-of select="policyEnforcement/@status"/>
                    </div>
                    <h3>Active Infrastructure Controls</h3>
                    <table>
                        <tr><th>ID</th><th>Security Objective</th><th>Status</th></tr>
                        <xsl:for-each select="policyEnforcement/control">
                            <tr>
                                <td><span class="badge"><xsl:value-of select="@id"/></span></td>
                                <td><xsl:value-of select="@name"/></td>
                                <td style="color:#3fb950;"><xsl:value-of select="@state"/></td>
                            </tr>
                        </xsl:for-each>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
