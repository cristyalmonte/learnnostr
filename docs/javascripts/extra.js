// Enhanced functionality for LearnNostr site

document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add copy button to code blocks
    addCopyButtonsToCodeBlocks();
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Add progress indicator for tutorials
    addProgressIndicator();
});

function addCopyButtonsToCodeBlocks() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.innerHTML = '📋 Copy';
        button.setAttribute('aria-label', 'Copy code to clipboard');
        
        button.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                button.innerHTML = '✅ Copied!';
                button.style.background = '#10b981';
                
                setTimeout(() => {
                    button.innerHTML = '📋 Copy';
                    button.style.background = '';
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
                button.innerHTML = '❌ Failed';
                setTimeout(() => {
                    button.innerHTML = '📋 Copy';
                }, 2000);
            }
        });
        
        pre.style.position = 'relative';
        pre.appendChild(button);
    });
}

function initializeInteractiveElements() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card, .community-card, .path-step');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // Add interactive quiz functionality
    initializeQuizzes();
}

function initializeQuizzes() {
    const quizQuestions = document.querySelectorAll('.admonition.question');
    
    quizQuestions.forEach(quiz => {
        const answers = quiz.querySelector('.admonition.success');
        if (answers) {
            answers.style.display = 'none';
            
            const showAnswersBtn = document.createElement('button');
            showAnswersBtn.textContent = 'Show Answers';
            showAnswersBtn.className = 'btn btn-outline quiz-btn';
            showAnswersBtn.style.marginTop = '1rem';
            
            showAnswersBtn.addEventListener('click', () => {
                if (answers.style.display === 'none') {
                    answers.style.display = 'block';
                    showAnswersBtn.textContent = 'Hide Answers';
                } else {
                    answers.style.display = 'none';
                    showAnswersBtn.textContent = 'Show Answers';
                }
            });
            
            quiz.appendChild(showAnswersBtn);
        }
    });
}

function addProgressIndicator() {
    // Only add progress indicator on tutorial pages
    if (window.location.pathname.includes('/tutorials/') || 
        window.location.pathname.includes('/getting-started/')) {
        
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="reading-progress-bar"></div>';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', updateReadingProgress);
    }
}

function updateReadingProgress() {
    const article = document.querySelector('article') || document.querySelector('main');
    if (!article) return;
    
    const articleHeight = article.offsetHeight;
    const articleTop = article.offsetTop;
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    const progress = Math.min(
        Math.max((scrollTop - articleTop + windowHeight) / articleHeight, 0),
        1
    );
    
    const progressBar = document.querySelector('.reading-progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progress * 100}%`;
    }
}

// Add CSS for interactive elements
const style = document.createElement('style');
style.textContent = `
    .copy-button {
        position: absolute;
        top: 8px;
        right: 8px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border: none;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 10;
    }
    
    pre:hover .copy-button {
        opacity: 1;
    }
    
    .copy-button:hover {
        background: rgba(0, 0, 0, 0.9);
    }
    
    .quiz-btn {
        font-size: 0.9rem !important;
        padding: 0.5rem 1rem !important;
    }
    
    .reading-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(102, 126, 234, 0.2);
        z-index: 1000;
    }
    
    .reading-progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #667eea, #764ba2);
        width: 0%;
        transition: width 0.3s ease;
    }
    
    .next-lesson {
        text-align: center;
        margin: 2rem 0;
    }
    
    .tutorial-navigation {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 3rem 0;
        padding: 2rem;
        background: var(--md-default-bg-color);
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }
    
    @media (max-width: 768px) {
        .tutorial-navigation {
            flex-direction: column;
            gap: 1rem;
        }
    }
`;
document.head.appendChild(style); 