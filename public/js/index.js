const extensions = {
    sh: 'bash',
    c: 'c',
    ccp: 'cpp',
    cs: 'csharp',
    css: 'css',
    diff: 'diff',
    go: 'go',
    ini: 'ini',
    java: 'java',
    js: 'javascript',
    json: 'json',
    kt: 'kotlin',
    less: 'less',
    lua: 'lua',
    make: 'makefile',
    xml: 'xml',
    md: 'markdown',
    m: 'objective-c',
    pl: 'perl',
    php: 'php',
    py: 'python',
    r: 'r',
    rs: 'rust',
    scss: 'scss',
    sql: 'sql',
    swift: 'swift',
    ts: 'typescript',
    vb: 'vb',
    yaml: 'yaml',
    txt: 'text'
}

const saveHaste = async () => {
    const content = document.getElementById('box').value;
    if (!content) return;

    const res = await fetch('/api/haste', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
    });
    
    if (res.status === 200) {
        const haste = await res.json();
        history.pushState(null, null, '/' + haste.id);
        showHaste(true);
    }
    else alert(res.status + ': ' + res.statusText);
}

window.onpopstate = () => {
    location.reload();
};

document.onkeydown = e => {
    if (e.ctrlKey && e.key === 's') {
        e.preventDefault();
        saveHaste()
    }
};

const fetchHaste = async (id) => {
    const res = await fetch('/api/haste/' + id);

    return (res.status === 200)
        ? await res.json()
        : null;
};

const login = async (event) => {
    event.preventDefault();
    const form = event.target;
    const username = form[0].value;
    const password = form[1].value;
    const button = form[2];
    const err = form.children[3];

    button.disabled = true;

    const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    button.disabled = false;

    if (res.status !== 200) {
        err.innerText = await res.text() || res.statusText;
        err.classList.add('shake');
        setTimeout(() => err.classList.remove('shake'), 500);
    }
    else {
        showEditor();
    }
}

const showLogin = () => {
    document.body.innerHTML = '<form><input type="text" id="username" placeholder="Username" autocomplete="username"/><input type="password" id="password" placeholder="Password" autocomplete="current-password"/><button type="submit">Login</button><span id="err"></span></form>'
    document.querySelector('form').addEventListener('submit', login);
};

const showEditor = () => {
    document.body.innerHTML = '<div id="lines">&gt;</div><textarea spellcheck="false" id="box"></textarea>';
}

const show404 = () => {
    document.body.innerHTML = '<svg width="220" height="170" fill="#fff"><path d="M121.514.022l86.975 1.307A11.8 11.8 0 0 1 220 13.088V156.91c-.024 6.391-5.126 11.603-11.515 11.764l-86.969 1.307H98.483l-86.965-1.309C5.126 168.519.019 163.304 0 156.91V13.089a11.81 11.81 0 0 1 11.518-11.76L98.486.022h23.028zM98.52 2.328L11.564 3.634a9.5 9.5 0 0 0-9.26 9.3V156.91a9.5 9.5 0 0 0 9.247 9.452l86.949 1.306h22.985l86.957-1.307a9.51 9.51 0 0 0 9.258-9.459V13.089a9.5 9.5 0 0 0-9.243-9.454L121.5 2.329c-5.76-.032-15.712-.028-22.981 0zM110 8.71c29.6 0 51.929.384 68 1.029l13.463.708 2.931.234.682.066.188.021c9.409.773 16.686 8.578 16.8 18.018h0V144.7c-.052 9.392-7.456 17.095-16.838 17.518l-.285.015-.863.041-3.539.146-14.9.444-65.637.646c-26.87 0-48.605-.242-65.639-.646l-14.9-.444-3.54-.146-.863-.041-.273-.014A17.65 17.65 0 0 1 7.937 144.7h0V28.785c.092-9.453 7.386-17.272 16.81-18.018h-.02l.149-.016.053-.006.682-.066 2.931-.234C31.93 10.2 36.374 9.961 42 9.736c16.07-.641 38.4-1.027 68-1.027zm0 1.537c-29.581 0-51.888.384-67.936 1.028l-13.413.706-2.9.231-.664.064-.2.022h0-.041A16.72 16.72 0 0 0 9.473 28.785h0V144.7c.061 8.569 6.819 15.592 15.38 15.982l.279.014.857.041q1.44.066 3.528.146l14.881.443 65.6.645 65.6-.645 14.88-.443 3.528-.146.857-.041.293-.015c8.56-.388 15.317-7.414 15.37-15.983h0V28.785A16.77 16.77 0 0 0 195.121 12.3l-.2-.022-.665-.065-2.9-.231c-3.372-.241-7.8-.481-13.415-.706-16.049-.643-38.356-1.029-67.938-1.029zM49 60.245v-2.3q0-1.344 1.344-.768l34.276 12.96c.704.228 1.173.893 1.152 1.632v2.592c.058.75-.426 1.435-1.152 1.632L50.344 89.045Q49 89.429 49 88.277v-2.4c-.057-.624.351-1.196.96-1.344l31.588-11.424-31.584-11.52c-.633-.112-1.061-.708-.964-1.344zm78.441 53.276H94.029q-1.152 0-1.152-1.056v-1.436q0-.96 1.152-.96h33.412q1.152 0 1.152.96v1.44q0 1.052-1.152 1.052zm44.165-55.58v2.3q0 1.152-.864 1.344l-31.683 11.524 31.683 11.424q.864.192.864 1.344v2.4q0 1.152-1.344.768l-34.18-13.056a1.58 1.58 0 0 1-1.248-1.632v-2.592a1.68 1.68 0 0 1 1.248-1.632l34.182-12.96q1.342-.576 1.342.768z"/></svg><h1>404: Haste not found</h1>';
}

const showHaste = async (fromSave=false) => {
    const id = location.pathname.split('/')[1].split('.')[0];
    const haste = await fetchHaste(id);
    if (!haste) return show404();

    document.title = `Hastebin - ${haste._id}`;
    const length = haste.content.split('\n').length;
    const lines = Array.from({ length }, (_, i) => i + 1);
    document.body.innerHTML = `<div id="lines">${lines.join('<br/>')}</div><pre><code class="hljs"></code></pre>`;

    const code = document.querySelector('code');
    const path = location.pathname;
    const extension = path.includes('.') ? path.split('.').pop() : null;
    const language = extensions[extension] || 'text';

    if (fromSave || !extension) {
        const hl = hljs.highlightAuto(haste.content);
        code.innerHTML = hl.value;
        const ext = Object.keys(extensions).find(k => extensions[k] === hl.language);
        if (fromSave) history.replaceState(null, null, `/${id}${ ext ? ('.'+ext) : ''}`);
    }
    else {
        code.innerHTML = hljs.highlight(haste.content, { language }).value;
    }
}

const isAuthenticated = async () => {
    const res = await fetch('/api/user');
    return res.status === 200;
}

(async () => {
    if (location.pathname === '/') {
        const authenticated = await isAuthenticated();
        if (!authenticated) return showLogin();
        showEditor();
    }
    else {
        showHaste();
    }
})();
