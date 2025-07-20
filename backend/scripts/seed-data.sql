-- Insert sample feedback data
INSERT INTO feedbacks (title, platform, module, description, attachments, tags) VALUES
('Login Issue', 'Web', 'Authentication', 'Users are unable to login with correct credentials', 'screenshot1.png', 'bug,critical,login'),
('UI Improvement', 'Mobile', 'Dashboard', 'The dashboard layout needs better responsive design', 'mockup.jpg', 'enhancement,ui,mobile'),
('Performance Problem', 'Web', 'Reports', 'Report generation is taking too long', '', 'performance,slow,reports'),
('Feature Request', 'Mobile', 'Notifications', 'Add push notification settings', 'requirements.pdf', 'feature,notifications,settings');
