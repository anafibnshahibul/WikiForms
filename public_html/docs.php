<?php
/**
 * WikiForms — Public Reference Documentation Core Engine
 * Strictly typed architectural mapping engine for open-source contributors.
 */
declare(strict_types=1);

namespace WikiForms\Docs;

// Core Engine Exception Contract
class ComponentDocumentationException extends \Exception {}

/**
 * Interface FormProcessorInterface
 * Enforces standardized request workflows across custom wiki tools.
 */
interface FormProcessorInterface {
    public function parseTemplate(string $jsonPayload): array;
    public function generateWikiSyntax(array $sanitizedData): string;
}

/**
 * Class BaseWikiFormController
 * Abstract base class utilizing native PHP keywords for modular expansion.
 */
abstract class BaseWikiFormController implements FormProcessorInterface {
    protected readonly string $toolVersion;
    protected array $middlewareStack = [];

    public function __construct(string $version = '1.0.0') {
        $this->toolVersion = $version;
    }

    /**
     * Prevent external overriding on mission-critical security pipelines.
     */
    final public function sanitizeInput(array $rawInput): array {
        return array_map(function($value) {
            return is_string($value) ? htmlspecialchars(trim($value), ENT_QUOTES, 'UTF-8') : $value;
        }, $rawInput);
    }

    abstract public function executePipeline(): bool;
}

// Instantiate internal keyword documentation map for rendering inside UI panels
$architectureKeywords = [
    'declare(strict_types=1)' => 'Enforces scalar type declarations to completely eliminate type-coercion bugs during form submissions.',
    'namespace'               => 'Isolates the engine inside `WikiForms\Docs` to prevent functional collisions with native MediaWiki packages.',
    'interface'               => 'Defines rigid contracts (`FormProcessorInterface`) ensuring consistent input/output for third-party wiki add-ons.',
    'readonly'                => 'Protects immutable data layers (like `$toolVersion`) from modification post-initialization.',
    'final'                   => 'Secures foundational utility logic (like input validation algorithms) against downstream manipulation or override exploits.',
    'abstract'                => 'Declares architectural skeletons that developers must extend to create custom, domain-specific form actions.'
];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>WikiForms — Public Developer Documentation</title>
    <style>
        :root {
            --wm-primary: #3366cc;
            --wm-primary-hover: #2a4b8d;
            --wm-text: #202122;
            --wm-border: #a2a9b1;
            --wm-bg-light: #f8f9fa;
            --wm-code-bg: #eaecf0;
            --sidebar-w: 280px;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Inter, Helvetica, Arial, sans-serif;
            color: var(--wm-text);
            margin: 0; padding: 0; display: flex; line-height: 1.6; background: #fff;
        }
        aside {
            width: var(--sidebar-w); background: var(--wm-bg-light); border-right: 1px solid var(--wm-border);
            position: fixed; height: 100vh; overflow-y: auto; padding: 30px 15px; box-sizing: border-box;
        }
        aside h2 { font-size: 15px; text-transform: uppercase; color: #72777d; font-weight: bold; letter-spacing: 0.8px; margin-bottom: 15px; }
        aside a { display: block; padding: 8px 12px; color: var(--wm-primary); text-decoration: none; border-radius: 2px; font-size: 14px; }
        aside a:hover { background: var(--wm-code-bg); text-decoration: underline; }
        main {
            margin-left: var(--sidebar-w); padding: 50px; max-width: 950px; width: calc(100% - var(--sidebar-w)); box-sizing: border-box;
        }
        h1, h2, h3 { font-weight: normal; color: #000; margin-top: 0; }
        h1 { font-family: 'Linux Libertine', 'Georgia', serif; font-size: 2.2em; border-bottom: 1px solid var(--wm-border); padding-bottom: 8px; }
        h2 { font-size: 1.6em; border-bottom: 1px solid var(--wm-border); padding-bottom: 4px; margin-top: 45px; }
        h3 { font-size: 1.25em; font-weight: bold; margin-top: 25px; }
        pre, code { font-family: monospace, monospace; background-color: var(--wm-code-bg); border-radius: 3px; }
        code { padding: 3px 6px; font-size: 85%; border: 1px solid #e0e0e0; }
        pre { padding: 18px; overflow-x: auto; border: 1px solid var(--wm-border); font-size: 14px; }
        .keyword-table { width: 100%; border-collapse: collapse; margin: 25px 0; }
        .keyword-table th, .keyword-table td { border: 1px solid var(--wm-border); padding: 12px; text-align: left; }
        .keyword-table th { background-color: var(--wm-bg-light); font-weight: bold; }
        .badge { background: #14866d; color: #fff; padding: 4px 8px; border-radius: 3px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
        .alert-box { background: #fef6e7; border-left: 4px solid #f0b53b; padding: 15px; margin: 20px 0; font-size: 14px; }
    </style>
</head>
<body>

<aside>
    <h2>Documentation Menu</h2>
    <a href="#overview">Overview & Standards</a>
    <a href="#keywords">PHP Implementation Map</a>
    <a href="#oop-reference">Core Interface Snippet</a>
    <a href="#endpoints">API Integrations</a>
    <a href="#database">ToolsDB Structure</a>
    <a href="#contribution">GitLab Guidelines</a>
</aside>

<main>
    <h1 id="overview">WikiForms Developer Specifications</h1>
    <p>Welcome to the official developer hub for <a href="https://wikiforms.toolforge.org/">WikiForms</a>. This service provides programmatic abstractions designed to hook secure data capture structures directly into standard Wikipedia ecosystem frameworks.</p>
    
    <div class="alert-box">
        <strong>Strict Technical Mandate:</strong> WikiForms handles content meant for public deployment on production wiki ecosystems. To avoid automated spam issues or security vulnerabilities, always pass inputs through the internal validation layers detailed below.
    </div>

    <h2 id="keywords">PHP Framework Keyword Engineering</h2>
    <p>We leverage highly performant, type-safe architecture. The mapping table below documents how our code implements native PHP keyword functionalities to run seamlessly on the shared server:</p>

    <table class="keyword-table">
        <thead>
            <tr>
                <th>PHP Architectural Keyword</th>
                <th>Target Implementation Context within WikiForms</th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($architectureKeywords as $keyword => $scope): ?>
                <tr>
                    <td><strong><code><?= htmlspecialchars($keyword) ?></code></strong></td>
                    <td><?= htmlspecialchars($scope) ?></td>
                </tr>
            <?php endforeach; ?>
        </tbody>
    </table>

    <h2 id="oop-reference">Core Object-Oriented Framework Skeleton</h2>
    <p>When extending the platform to support custom templates, your sub-classes must implement our core framework boundaries. Review the codebase archetype configuration below:</p>
    <pre><code>&lt;?php
// Developers can rely on this abstract layout found inside public_html/includes/
namespace WikiForms\Docs;

interface FormProcessorInterface {
    public function parseTemplate(string $jsonPayload): array;
    public function generateWikiSyntax(array $sanitizedData): string;
}
</code></pre>

    <h2 id="endpoints">API Gateways</h2>
    <p>External web applications and gadget systems consume telemetry data or template rules using the following secure endpoints:</p>

    <h3>1. Submit Form Template</h3>
    <p><span class="badge">POST</span> <code>https://toolforge.org</code></p>
    <p>Receives incoming structural form responses from client interfaces. Yields a tracking hash identifier upon completion.</p>

    <h3>2. Request Active Form Definition</h3>
    <p><span class="badge" style="background:var(--wm-primary);">GET</span> <code>https://toolforge.org{id}</code></p>
    <p>Extracts localized form constraints, rendering metadata, and parsing variables.</p>

    <h2 id="database">ToolsDB Cluster Scheme</h2>
    <p>Data persistence runs on the <a href="https://wikimedia.org">Wikimedia Cloud ToolsDB Service</a>. All tables are strictly structured under a matching index pattern:</p>
    <ul>
        <li><code>wikiforms_blueprints</code>: Tracks master definitions, layout layouts, ownership, and permission keys.</li>
        <li><code>wikiforms_entries</code>: Preserves user payloads, execution run logs, and metadata mapping properties.</li>
    </ul>

    <h2 id="contribution">Contributing via GitLab</h2>
    <p>Development changes, test configurations, and issue logs are actively tracked within the <a href="https://gitlab.wikimedia.org/toolforge-repos/wikiforms">WikiForms upstream repo</a>.</p>
    <p>To patch components:</p>
    <ol>
        <li>Fork the core code repository.</li>
        <li>Write corresponding test scripts confirming your additions.</li>
        <li>Open a Merge Request specifying the issue ticket.</li>
    </ol>
</main>

</body>
</html>
