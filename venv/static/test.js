// Mock data for testing
const mockData = {
    'Key Takeaways': 'These are the key takeaways from the session.',
    'Full Summary': 'This is the full summary of the content discussed in the session.',
    'Active Practice': 'Here are some flashcards for active practice.',
    'Transcript': 'This is the full transcript of the audio/video session.'
  };
  
  // Variables for managing the active tab, content, and state
  let activeTab = 'Key Takeaways';
  let content = '';
  
  // Set up initial content
  document.getElementById('content').innerHTML = content;
  
  // Function to update the active tab and its content
  function updateActiveTab(newTab) {
    activeTab = newTab;
    document.getElementById('activeTabTitle').innerText = activeTab;
  
    // Remove 'active' class from all buttons
    const buttons = document.querySelectorAll('.sidebar button');
    buttons.forEach(button => button.classList.remove('active'));
  
    // Add 'active' class to the clicked button
    const activeButton = document.getElementById(`${newTab.replace(/\s+/g, '').toLowerCase()}Btn`);
    activeButton.classList.add('active');
  
    // Set the content based on the active tab (using mock data)
    document.getElementById('content').innerHTML = mockData[newTab] || 'Content not available.';
  }
  
  // Handle tab button clicks
  document.getElementById('keyTakeawaysBtn').addEventListener('click', () => updateActiveTab('Key Takeaways'));
  document.getElementById('fullSummaryBtn').addEventListener('click', () => updateActiveTab('Full Summary'));
  document.getElementById('activePracticeBtn').addEventListener('click', () => updateActiveTab('Active Practice'));
  document.getElementById('transcriptBtn').addEventListener('click', () => updateActiveTab('Transcript'));
  
  // Set initial content when the page loads
  updateActiveTab(activeTab);
  