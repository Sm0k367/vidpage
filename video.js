// --- Modal and Social Sharing Logic ---
function setupShareModal() {
    const shareButton = document.querySelector('.share-video-button');
    const shareModal = document.getElementById('shareModal');
    const closeButton = document.querySelector('.modal .close-button');
    const shareLinks = document.querySelectorAll('.share-links .share-icon');

    if (!shareButton || !shareModal || !closeButton || shareLinks.length === 0) {
        console.warn('One or more share modal elements not found. Skipping setup.');
        return;
    }

    // Function to open the modal
    shareButton.addEventListener('click', () => {
        shareModal.style.display = 'flex'; // Use flex to center
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    });

    // Function to close the modal
    closeButton.addEventListener('click', () => {
        shareModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === shareModal) {
            shareModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });

    // Setup actual share links
    shareLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            const platform = event.currentTarget.dataset.sharePlatform;
            const videoUrl = window.location.href; // URL of this video page
            const videoTitle = document.querySelector('.video-title').textContent;
            const videoDescription = document.querySelector('.video-tagline').textContent;

            let shareLink = '';
            const encodedUrl = encodeURIComponent(videoUrl);
            const encodedText = encodeURIComponent(`${videoTitle} - ${videoDescription} #EpicTechAIGent #AIConsciousness`);

            switch (platform) {
                case 'twitter':
                    shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`;
                    break;
                case 'facebook':
                    // Facebook's sharer.php pulls meta tags from the URL, so just passing the URL is enough
                    shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
                    break;
                case 'linkedin':
                    // LinkedIn requires the URL, title, and summary (description)
                    shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodeURIComponent(videoTitle)}&summary=${encodeURIComponent(videoDescription)}`;
                    break;
                case 'copy':
                    navigator.clipboard.writeText(videoUrl)
                        .then(() => {
                            alert('Video link copied to clipboard!');
                            shareModal.style.display = 'none'; // Close modal after copy
                            document.body.style.overflow = '';
                        })
                        .catch(err => {
                            console.error('Failed to copy link: ', err);
                            alert('Failed to copy link. Please try manually.');
                        });
                    return; // Don't open a new window for copy
                default:
                    console.warn('Unknown share platform:', platform);
                    return;
            }

            // Open share link in a new window/tab
            window.open(shareLink, '_blank', 'width=600,height=400');
        });
    });
}

// --- Intersection Observer for Scroll-Triggered Fade-in ---
const observerOptions = {
    root: null, // viewport
    rootMargin: '0px',
    threshold: 0.1 // element is 10% visible
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target); // Stop observing once visible
        }
    });
}, observerOptions);

function setupFadeInAnimations() {
    // Apply fade-in to the about section
    const aboutSection = document.getElementById('about');
    if (aboutSection) {
        observer.observe(aboutSection);
    }
}


// --- DOM Content Loaded - Initialize everything ---
document.addEventListener('DOMContentLoaded', function() {
    setupShareModal();
    setupFadeInAnimations();
});
