// Sample article data
const posts = [
  {
    id: 1,
    title: '如何开始前端之路',
    date: '2025-01-10',
    tags: ['前端', '入门', 'JavaScript'],
    excerpt: '从零开始学习 HTML/CSS/JavaScript 的路线与建议。',
    content: '<p>前端开发从 HTML 开始，然后学习 CSS 布局与样式，接着掌握 JavaScript 基础，最后学习框架与工具链。</p>',
  },
  {
    id: 2,
    title: '写给自己的一封技术总结',
    date: '2025-03-05',
    tags: ['随笔', '总结'],
    excerpt: '记录过去一年在项目中学到的重要经验与教训。',
    content: '<p>每个项目都会教会你一些东西。写下它们，便于下次回顾。</p>',
  },
  {
    id: 3,
    title: 'CSS 布局现代方式',
    date: '2025-06-18',
    tags: ['CSS', '布局', '指南'],
    excerpt: 'Flexbox 与 Grid 的组合使用场景与示例。',
    content: '<p>Flexbox 适合一维布局，Grid 适合二维布局。二者结合可以胜任大多数布局需求。</p>',
  },
]

const postsEl = document.getElementById('posts')
const tagListEl = document.getElementById('tagList')
const searchInput = document.getElementById('search')
const themeToggle = document.getElementById('themeToggle')
const postModal = document.getElementById('postModal')
const postContent = document.getElementById('postContent')

function renderPosts(list) {
  postsEl.innerHTML = ''
  if (list.length === 0) {
    postsEl.innerHTML = '<div class="card">没有找到匹配的文章。</div>'
    return
  }
  list.forEach((p) => {
    const el = document.createElement('article')
    el.className = 'card'
    el.innerHTML = `
      <h2 class="post-title"><a href="#" data-id="${p.id}">${p.title}</a></h2>
      <div class="post-meta">${p.date} · ${p.tags.join(' / ')}</div>
      <div class="excerpt">${p.excerpt}</div>
      <div class="tags">${p.tags.map((t) => `<span class="tag" data-tag="${t}">${t}</span>`).join('')}</div>
    `
    postsEl.appendChild(el)
  })
}

function getAllTags() {
  const s = new Set()
  posts.forEach((p) => p.tags.forEach((t) => s.add(t)))
  return Array.from(s)
}

function renderTags() {
  const tags = getAllTags()
  tagListEl.innerHTML = tags.map((t) => `<a href="#" data-filter="${t}" class="tag">${t}</a>`).join(' ')
}

function filterByQuery(q) {
  q = q.trim().toLowerCase()
  if (!q) return posts
  return posts.filter((p) => {
    return p.title.toLowerCase().includes(q) || p.excerpt.toLowerCase().includes(q) || p.tags.join(' ').toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
  })
}

// Events
searchInput.addEventListener('input', () => {
  const list = filterByQuery(searchInput.value)
  renderPosts(list)
})

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[data-id]')
  if (a) {
    e.preventDefault()
    const id = Number(a.dataset.id)
    const p = posts.find((x) => x.id === id)
    if (p) {
      postContent.innerHTML = `<h2>${p.title}</h2><div class="post-meta">${p.date} · ${p.tags.join(' / ')}</div>${p.content}`
      postModal.style.display = 'flex'
    }
    return
  }

  const t = e.target.closest('[data-filter]')
  if (t) {
    e.preventDefault()
    const tag = t.dataset.filter
    const list = posts.filter((p) => p.tags.includes(tag))
    renderPosts(list)
    return
  }

  const tagChip = e.target.closest('.tag[data-tag]')
  if (tagChip) {
    const tag = tagChip.dataset.tag
    const list = posts.filter((p) => p.tags.includes(tag))
    renderPosts(list)
    return
  }

  // close modal when clicking outside content
  if (e.target === postModal) {
    postModal.style.display = 'none'
  }
})

// theme
function loadTheme() {
  const theme = localStorage.getItem('theme')
  if (theme === 'dark') document.documentElement.classList.add('dark')
}
loadTheme()
themeToggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark')
  const isDark = document.documentElement.classList.contains('dark')
  localStorage.setItem('theme', isDark ? 'dark' : 'light')
})

// init
renderTags()
renderPosts(posts)
