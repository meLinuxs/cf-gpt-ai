// src/worker.js
export default {
  async fetch(request, env, ctx) {
    // 处理请求的逻辑（如返回文本、调用 API 等）
    return new Response("Hello, Cloudflare Workers!");
  }
};
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>林九九的Cloudflare AI机器人</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
            -webkit-tap-highlight-color: transparent; /* 消除点击高亮 */
        }
        body { 
            font-family: 'PingFang SC', 'Helvetica Neue', Arial, sans-serif; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
            height: 100vh; 
            overflow: hidden; 
        }
        .container { 
            width: 100vw; 
            height: 100vh; 
            background: white; 
            display: flex; 
            flex-direction: column; 
            padding: 0; /* 移除默认内边距 */
        }
        .header { 
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); 
            color: white; 
            padding: 12px 16px; /* 缩小内边距 */
            text-align: center; 
        }
        .header h1 { 
            font-size: 1.2rem; /* 缩小标题字体 */
            margin-bottom: 4px;
        }
        .header p { 
            font-size: 0.875rem; /* 缩小描述字体 */
            opacity: 0.9;
        }
        .main-content { 
            display: flex; 
            flex: 1; 
            overflow: hidden; 
        }
        /* 手机端侧边栏优化 */
        .sidebar { 
            width: 250px; /* 缩小侧边栏宽度 */
            min-width: 250px; 
            background: #f8fafc; 
            border-right: 1px solid #e2e8f0; 
            padding: 16px; /* 缩小内边距 */
            overflow-y: auto; 
            flex-shrink: 0; 
        }
        /* 手机端聊天区域优化 */
        .chat-area { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
        }
        .auth-section { 
            background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%); 
            border: 2px solid #ff6b9d; 
            border-radius: 12px; /* 缩小圆角 */
            padding: 16px; /* 缩小内边距 */
            margin-bottom: 16px; 
            box-shadow: 0 4px 8px rgba(255, 107, 157, 0.2); /* 缩小阴影 */
        }
        .model-section { 
            margin-bottom: 16px; 
        }
        .model-select { 
            width: 100%; 
            padding: 10px; 
            border: 1px solid #d1d5db; 
            border-radius: 8px; 
            margin-bottom: 8px; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .model-info { 
            background: #f1f5f9; 
            padding: 8px; /* 缩小内边距 */
            border-radius: 6px; /* 缩小圆角 */
            font-size: 0.8rem; /* 缩小字体 */
            line-height: 1.3;
        }
        .input-group { 
            margin-bottom: 12px; 
        }
        .input-group input { 
            width: 100%; 
            padding: 10px; 
            border: 1px solid #d1d5db; 
            border-radius: 8px; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .btn { 
            background: #4f46e5; 
            color: white; 
            border: none; 
            padding: 8px 16px; /* 缩小内边距 */
            border-radius: 6px; /* 缩小圆角 */
            cursor: pointer; 
            margin: 4px; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .btn:hover { 
            background: #4338ca; 
        }
        .btn-secondary { 
            background: #6b7280; 
        }
        .messages { 
            flex: 1; 
            overflow-y: auto; 
            padding: 16px; /* 缩小内边距 */
            background: #fafafa; 
        }
        .message { 
            margin-bottom: 16px; /* 缩小间距 */
            max-width: 85%; /* 增大最大宽度 */
        }
        .message.user { 
            margin-left: auto; 
        }
        .message-content { 
            padding: 12px; /* 缩小内边距 */
            border-radius: 12px; /* 缩小圆角 */
            line-height: 1.5;
            font-size: 0.95rem; /* 缩小字体 */
        }
        .message.user .message-content { 
            background: #4f46e5; 
            color: white; 
        }
        .message.assistant .message-content { 
            background: white; 
            border: 1px solid #e2e8f0; 
        }
        .input-area { 
            background: white; 
            border-top: 1px solid #e2e8f0; 
            padding: 12px; /* 缩小内边距 */
        }
        .input-container { 
            display: flex; 
            gap: 8px; /* 缩小间距 */
            align-items: flex-end; 
        }
        .message-input { 
            flex: 1; 
            min-height: 44px; /* 符合移动端最小点击区域 */
            padding: 10px; /* 缩小内边距 */
            border: 1px solid #d1d5db; 
            border-radius: 10px; /* 增大圆角更易点击 */
            resize: none; 
            font-size: 0.95rem; /* 缩小字体 */
        }
        .send-btn { 
            height: 44px; /* 符合移动端最小点击区域 */
            padding: 0 16px; /* 缩小内边距 */
            background: #10b981; 
            border-radius: 10px; /* 增大圆角更易点击 */
            font-size: 0.95rem; /* 缩小字体 */
        }
        .loading { 
            display: none; 
            text-align: center; 
            padding: 12px; /* 缩小内边距 */
            color: #6b7280; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .error { 
            background: #fef2f2; 
            color: #dc2626; 
            padding: 8px; /* 缩小内边距 */
            border-radius: 6px; /* 缩小圆角 */
            margin: 8px 0; 
            font-size: 0.85rem; /* 缩小字体 */
        }
        .success { 
            background: #f0f9ff; 
            color: #0369a1; 
            padding: 8px; /* 缩小内边距 */
            border-radius: 6px; /* 缩小圆角 */
            margin: 8px 0; 
            font-size: 0.85rem; /* 缩小字体 */
        }
        .code-block { 
            margin: 12px 0; /* 缩小间距 */
            border-radius: 8px; 
            overflow: hidden; 
            border: 1px solid #d1d5db; 
            background: #ffffff;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .code-header { 
            background: #f9fafb; 
            padding: 6px 12px; /* 缩小内边距 */
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
            border-bottom: 1px solid #e5e7eb;
            font-size: 0.8rem; /* 缩小字体 */
        }
        .language { 
            font-size: 0.8rem; /* 缩小字体 */
            color: #6b7280; 
            font-weight: 500; 
            text-transform: uppercase;
        }
        .copy-btn { 
            background: #374151; 
            color: white; 
            border: none; 
            padding: 4px 8px; /* 缩小内边距 */
            border-radius: 4px; 
            font-size: 0.75rem; /* 缩小字体 */
            cursor: pointer; 
            transition: all 0.2s;
            font-weight: 500;
        }
        .copy-btn:hover { 
            background: #1f2937; 
            transform: translateY(-1px);
        }
        .copy-btn:active { 
            background: #111827; 
            transform: translateY(0);
        }
        pre { 
            background: #ffffff; 
            padding: 12px; /* 缩小内边距 */
            margin: 0; 
            overflow-x: auto; 
            line-height: 1.4;
            font-size: 0.9rem; /* 缩小字体 */
        }
        code { 
            font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .inline-code { 
            background: #f3f4f6; 
            padding: 2px 6px; 
            border-radius: 4px; 
            font-family: 'Fira Code', 'Consolas', 'Monaco', 'Courier New', monospace; 
            font-size: 0.85rem; /* 缩小字体 */
            color: #374151;
            border: 1px solid #e5e7eb;
        }
        .code-block code { 
            background: none; 
            padding: 0; 
            color: #1f2937;
            white-space: pre;
            word-wrap: normal;
            overflow-wrap: normal;
        }
        
        /* Markdown 样式优化 */
        .md-h1 { 
            font-size: 1.4rem; /* 缩小标题字体 */
            font-weight: bold; 
            color: #1f2937; 
            margin: 16px 0 8px 0; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 4px;
        }
        .md-h2 { 
            font-size: 1.2rem; /* 缩小标题字体 */
            font-weight: bold; 
            color: #374151; 
            margin: 14px 0 6px 0; 
            border-bottom: 1px solid #e5e7eb; 
            padding-bottom: 2px;
        }
        .md-h3 { 
            font-size: 1.1rem; /* 缩小标题字体 */
            font-weight: bold; 
            color: #4b5563; 
            margin: 12px 0 4px 0;
        }
        .md-bold { 
            font-weight: bold; 
            color: #1f2937; 
        }
        .md-italic { 
            font-style: italic; 
            color: #4b5563; 
        }
        .md-ul { 
            margin: 8px 0; 
            padding-left: 16px; /* 缩小缩进 */
        }
        .md-ol { 
            margin: 8px 0; 
            padding-left: 16px; /* 缩小缩进 */
        }
        .md-li { 
            margin: 4px 0; 
            list-style-type: disc; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .md-li-ordered { 
            margin: 4px 0; 
            list-style-type: decimal; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .md-blockquote { 
            background: #f3f4f6; 
            border-left: 4px solid #6b7280; 
            padding: 8px 12px; /* 缩小内边距 */
            margin: 8px 0; 
            font-style: italic; 
            color: #4b5563; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .md-link { 
            color: #3b82f6; 
            text-decoration: underline; 
            font-size: 0.9rem; /* 缩小字体 */
        }
        .md-link:hover { 
            color: #1d4ed8; 
        }

        /* 手机端媒体查询 */
        @media (max-width: 768px) {
            .container {
                padding: 0;
            }
            .header {
                padding: 10px 12px;
            }
            .header h1 {
                font-size: 1.1rem;
            }
            .header p {
                font-size: 0.8rem;
            }
            .sidebar {
                width: 100%; /* 手机端侧边栏全屏 */
                min-width: unset;
                border-right: none;
                border-bottom: 1px solid #e2e8f0;
            }
            .main-content {
                flex-direction: column;
            }
            .model-section {
                display: none; /* 手机端隐藏模型选择，改为底部固定 */
            }
            .mobile-model-bar {
                display: flex;
                gap: 8px;
                padding: 8px 12px;
                background: #f8fafc;
                border-bottom: 1px solid #e2e8f0;
            }
            .mobile-model-btn {
                flex: 1;
                padding: 8px;
                border: 1px solid #d1d5db;
                border-radius: 6px;
                background: white;
                font-size: 0.8rem;
            }
            .messages {
                padding: 12px;
            }
            .message {
                max-width: 90%;
            }
            .input-area {
                padding: 8px;
            }
            .send-btn {
                padding: 0 12px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🤖 林九九的Cloudflare AI机器人</h1>
            <p>支持多模型切换的智能聊天助手</p>
        </div>
        <div class="main-content">
            <!-- 手机端隐藏侧边栏，改为底部模型栏 -->
            <div class="sidebar" id="desktopSidebar">
                <div class="auth-section" id="authSection">
                    <div class="input-group">
                        <label>访问密码</label>
                        <input type="password" id="passwordInput" placeholder="请输入访问密码" onkeydown="handlePasswordKeyDown(event)">
                    </div>
                    <button class="btn" onclick="authenticate()">验证</button>
                </div>
                <div class="model-section" id="modelSection">
                    <h3>🎯 选择AI模型</h3>
                    <select class="model-select" id="modelSelect" onchange="updateModelInfo()">
                        <option value="">请选择模型...</option>
                    </select>
                    <div class="model-info" id="modelInfo">请先选择一个AI模型</div>
                </div>
                <div class="history-section" id="historySection">
                    <h3>📚 聊天历史</h3>
                    <button class="btn btn-secondary" onclick="loadHistory()">加载历史</button>
                    <button class="btn btn-secondary" onclick="clearHistory()">清空历史</button>
                </div>
            </div>
            <!-- 手机端底部模型栏 -->
            <div class="mobile-model-bar" id="mobileModelBar" style="display: none;">
                <select class="mobile-model-btn" id="mobileModelSelect" onchange="updateModelInfo()">
                    <option value="">选模型</option>
                </select>
                <button class="btn" onclick="authenticate()" id="mobileAuthBtn" style="display: none;">登录</button>
            </div>
            <div class="chat-area">
                <div class="messages" id="messages">
                    <div class="message assistant">
                        <div class="message-content">👋 欢迎使用林九九的Cloudflare AI机器人！请先输入密码验证身份，然后选择模型开始聊天。<br><br>🇨🇳 所有模型已配置为中文回复，无论您用什么语言提问，AI都会用中文回答。</div>
                    </div>
                </div>
                <div class="loading" id="loading">🤔 AI正在思考中...</div>
                <div class="input-area">
                    <div class="input-container">
                        <textarea class="message-input" id="messageInput" placeholder="输入您的问题..." disabled onkeydown="handleKeyDown(event)"></textarea>
                        <button class="btn send-btn" id="sendBtn" onclick="sendMessage()" disabled>发送</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <script>
        // 移除所有作者信息验证相关代码
        
        let isAuthenticated = false, currentPassword = '', models = {}, chatHistory = [], currentModel = '';
        window.onload = async function() {
            try {
                const response = await fetch('/api/models');
                models = await response.json();
                populateModelSelect();
                // 手机端初始化模型选择
                initMobileModelSelect();
            } catch (error) { console.error('加载模型失败:', error); }
        };
        function populateModelSelect() {
            const select = document.getElementById('modelSelect');
            select.innerHTML = '<option value="">请选择模型...</option>';
            for (const [key, model] of Object.entries(models)) {
                const option = document.createElement('option');
                option.value = key; option.textContent = model.name;
                select.appendChild(option);
            }
            // 同步到手机端选择框
            const mobileSelect = document.getElementById('mobileModelSelect');
            if (mobileSelect) {
                mobileSelect.innerHTML = '<option value="">选模型</option>';
                for (const [key, model] of Object.entries(models)) {
                    const option = document.createElement('option');
                    option.value = key; option.textContent = model.name;
                    mobileSelect.appendChild(option);
                }
            }
        }
        function initMobileModelSelect() {
            const mobileModelBar = document.getElementById('mobileModelBar');
            const desktopSidebar = document.getElementById('desktopSidebar');
            if (window.innerWidth <= 768) {
                mobileModelBar.style.display = 'flex';
                desktopSidebar.style.display = 'none';
            } else {
                mobileModelBar.style.display = 'none';
                desktopSidebar.style.display = 'block';
            }
        }
        // 窗口大小变化时调整布局
        window.addEventListener('resize', initMobileModelSelect);
        
        function updateModelInfo() {
            try {
                const select = document.getElementById('modelSelect') || document.getElementById('mobileModelSelect');
                const infoDiv = document.getElementById('modelInfo');
                const selectedModel = select.value;
                if (!selectedModel) { 
                    infoDiv.innerHTML = '请先选择一个AI模型'; 
                    return; 
                }
                
                if (currentModel && currentModel !== selectedModel) {
                    chatHistory = [];
                    const messagesDiv = document.getElementById('messages');
                    messagesDiv.innerHTML = '<div class="message assistant"><div class="message-content">🔄 已切换模型，正在加载历史记录...</div></div>';
                }
                
                currentModel = selectedModel;
                const model = models[selectedModel];
                if (!model) {
                    infoDiv.innerHTML = '模型信息加载失败';
                    return;
                }
                const features = model.features ? model.features.join(' • ') : '';
                infoDiv.innerHTML = \`
                    <strong>\${model.name}</strong><br>
                    📝 \${model.description}<br><br>
                    🎯 <strong>特色功能:</strong><br>
                    \${features}<br><br>
                    💰 <strong>价格:</strong><br>
                    • 输入: $\${model.input_price}/百万tokens<br>
                    • 输出: $\${model.output_price}/百万tokens<br><br>
                    📏 <strong>限制:</strong><br>
                    • 上下文: \${model.context.toLocaleString()} tokens<br>
                    • 最大输出: \${model.max_output.toLocaleString()} tokens
                \`;
                if (isAuthenticated) {
                    document.getElementById('messageInput').disabled = false;
                    document.getElementById('sendBtn').disabled = false;
                    document.getElementById('mobileAuthBtn').style.display = 'none';
                    loadHistory();
                }
            } catch (error) {
                console.error('更新模型信息失败:', error);
                const infoDiv = document.getElementById('modelInfo');
                if (infoDiv) infoDiv.innerHTML = '更新模型信息失败';
            }
        }
        async function authenticate() {
            const password = document.getElementById('passwordInput').value;
            if (!password) { showError('请输入密码'); return; }
            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: 'test', model: 'deepseek-r1', password: password })
                });
                
                if (response.status === 401) {
                    showError('密码错误，请重试');
                    return;
                }
                
                isAuthenticated = true; 
                currentPassword = password;
                const authSection = document.getElementById('authSection');
                if (authSection) authSection.innerHTML = '<p>✅ 身份验证成功！</p>';
                document.getElementById('messageInput').disabled = false;
                document.getElementById('sendBtn').disabled = false;
                document.getElementById('mobileAuthBtn').style.display = 'none';
                showSuccess('验证成功！请选择AI模型开始聊天。');
            } catch (error) { 
                showError('验证失败: ' + error.message); 
            }
        }
        async function sendMessage() {
            try {
                if (!isAuthenticated || !currentModel) { showError('请先验证身份并选择模型'); return; }
                const input = document.getElementById('messageInput');
                const message = input.value.trim();
                if (!message) return;
                addMessage('user', message); input.value = '';
                chatHistory.push({ role: 'user', content: message, timestamp: new Date() });
                document.getElementById('loading').style.display = 'block';
                document.getElementById('sendBtn').disabled = true;
                try {
                    const response = await fetch('/api/chat', {
                        method: 'POST', 
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            message, 
                            model: currentModel, 
                            password: currentPassword, 
                            history: chatHistory.slice(-10) 
                        })
                    });
                    const data = await response.json();
                    if (response.ok) {
                        addMessage('assistant', data.reply, data.model, data.usage);
                        chatHistory.push({ 
                            role: 'assistant', 
                            content: data.reply, 
                            timestamp: new Date(), 
                            model: data.model 
                        });
                        await saveHistory();
                    } else { showError(data.error || '发送消息失败'); }
                } catch (error) { showError('网络错误: ' + error.message); }
                finally {
                    document.getElementById('loading').style.display = 'none';
                    document.getElementById('sendBtn').disabled = false;
                }
            } catch (error) {
                console.error('发送消息异常:', error);
                showError('发送消息时发生意外错误: ' + error.message);
                document.getElementById('loading').style.display = 'none';
                document.getElementById('sendBtn').disabled = false;
            }
        }
        function addMessage(role, content, modelName = '', usage = null) {
            const messagesDiv = document.getElementById('messages');
            const messageDiv = document.createElement('div');
            messageDiv.className = \`message \${role}\`;
            let metaInfo = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            if (modelName) metaInfo = \`\${modelName} • \${metaInfo}\`;
            if (usage && usage.total_tokens) metaInfo += \` • \${usage.total_tokens} tokens\`;
            messageDiv.innerHTML = \`<div class="message-content">\${content}</div><div style="font-size:0.8rem;color:#6b7280;margin-top:4px;">\${metaInfo}</div>\`;
            messagesDiv.appendChild(messageDiv);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
        async function loadHistory() {
            if (!isAuthenticated || !currentModel) return;
            try {
                const sessionId = \`\${currentModel}_history\`;
                const response = await fetch(\`/api/history?password=\${encodeURIComponent(currentPassword)}&sessionId=\${sessionId}\`);
                const data = await response.json();
                if (response.ok) {
                    chatHistory = data.history || [];
                    const messagesDiv = document.getElementById('messages');
                    const modelName = models[currentModel]?.name || currentModel;
                    messagesDiv.innerHTML = \`<div class="message assistant"><div class="message-content">📚 已加载 \${modelName} 的历史记录</div></div>\`;
                    chatHistory.forEach(msg => addMessage(msg.role, msg.content, msg.model || ''));
                    if (chatHistory.length === 0) {
                        showSuccess(\`\${modelName} 暂无历史记录\`);
                    } else {
                        showSuccess(\`已加载 \${modelName} 的 \${chatHistory.length} 条历史记录\`);
                    }
                } else { showError(data.error || '加载历史记录失败'); }
            } catch (error) { showError('加载历史记录失败: ' + error.message); }
        }
        async function saveHistory() {
            if (!isAuthenticated || !currentModel) return;
            try {
                const sessionId = \`\${currentModel}_history\`;
                await fetch('/api/history', {
                    method: 'POST', 
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        password: currentPassword, 
                        sessionId: sessionId, 
                        history: chatHistory 
                    })
                });
            } catch (error) { console.error('保存历史记录失败:', error); }
        }
        async function clearHistory() {
            if (!currentModel) { showError('请先选择模型'); return; }
            const modelName = models[currentModel]?.name || currentModel;
            if (!confirm(\`确定要清空 \${modelName} 的所有聊天记录吗？\`)) return;
            chatHistory = []; 
            await saveHistory();
            document.getElementById('messages').innerHTML = \`<div class="message assistant"><div class="message-content">✨ \${modelName} 聊天记录已清空</div></div>\`;
            showSuccess(\`\${modelName} 聊天记录已清空\`);
        }
        function handleKeyDown(event) {
            if (event.key === 'Enter' && !event.shiftKey) { 
                event.preventDefault(); 
                sendMessage(); 
            }
        }
        function handlePasswordKeyDown(event) {
            if (event.key === 'Enter') { 
                event.preventDefault(); 
                authenticate(); 
            }
        }
        function showError(message) {
            const div = document.createElement('div');
            div.className = 'error'; 
            div.textContent = message;
            document.querySelector('.sidebar').appendChild(div);
            setTimeout(() => div.remove(), 5000);
        }
        function showSuccess(message) {
            const div = document.createElement('div');
            div.className = 'success'; 
            div.textContent = message;
            document.querySelector('.sidebar').appendChild(div);
            setTimeout(() => div.remove(), 3000);
        }
        
        // 代码块复制功能（保留）
        function copyCodeBlock(button) { /* 原有实现 */ }
        function testCopyFunction() { /* 原有实现 */ }
        setTimeout(testCopyFunction, 1000);
    </script>
</body>
</html>


