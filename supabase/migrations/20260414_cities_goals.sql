-- Create study goals table
CREATE TABLE IF NOT EXISTS study_goals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cities table
CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    state TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(name, state)
);

-- Seed study goals
INSERT INTO study_goals (name, slug) VALUES 
('Engineering', 'engineering'),
('Management', 'management'),
('Commerce', 'commerce'),
('Arts', 'arts'),
('Science', 'science'),
('Law', 'law'),
('Medical', 'medical'),
('Design', 'design'),
('Architecture', 'architecture'),
('Pharmacy', 'pharmacy'),
('Education', 'education'),
('Hotel Management', 'hotel-management')
ON CONFLICT (name) DO NOTHING;

-- Seed major cities
INSERT INTO cities (name, state) VALUES 
('Mumbai', 'Maharashtra'),
('Delhi', 'Delhi'),
('Bengaluru', 'Karnataka'),
('Hyderabad', 'Telangana'),
('Ahmedabad', 'Gujarat'),
('Chennai', 'Tamil Nadu'),
('Kolkata', 'West Bengal'),
('Pune', 'Maharashtra'),
('Jaipur', 'Rajasthan'),
('Lucknow', 'Uttar Pradesh'),
('Kanpur', 'Uttar Pradesh'),
('Nagpur', 'Maharashtra'),
('Indore', 'Madhya Pradesh'),
('Thane', 'Maharashtra'),
('Bhopal', 'Madhya Pradesh'),
('Visakhapatnam', 'Andhra Pradesh'),
('Patna', 'Bihar'),
('Vadodara', 'Gujarat'),
('Ghaziabad', 'Uttar Pradesh'),
('Ludhiana', 'Punjab'),
('Agra', 'Uttar Pradesh'),
('Nashik', 'Maharashtra'),
('Faridabad', 'Haryana'),
('Meerut', 'Uttar Pradesh'),
('Rajkot', 'Gujarat'),
('Varanasi', 'Uttar Pradesh'),
('Srinagar', 'Jammu and Kashmir'),
('Aurangabad', 'Maharashtra'),
('Dhanbad', 'Jharkhand'),
('Amritsar', 'Punjab'),
('Navi Mumbai', 'Maharashtra'),
('Allahabad', 'Uttar Pradesh'),
('Howrah', 'West Bengal'),
('Ranchi', 'Jharkhand'),
('Gwalior', 'Madhya Pradesh'),
('Jabalpur', 'Madhya Pradesh'),
('Coimbatore', 'Tamil Nadu'),
('Vijayawada', 'Andhra Pradesh'),
('Jodhpur', 'Rajasthan'),
('Madurai', 'Tamil Nadu'),
('Raipur', 'Chhattisgarh'),
('Kota', 'Rajasthan'),
('Guwahati', 'Assam'),
('Chandigarh', 'Chandigarh'),
('Solapur', 'Maharashtra'),
('Mysore', 'Karnataka'),
('Gurgaon', 'Haryana'),
('Aligarh', 'Uttar Pradesh'),
('Jalandhar', 'Punjab'),
('Bhubaneswar', 'Odisha'),
('Salem', 'Tamil Nadu'),
('Warangal', 'Telangana'),
('Guntur', 'Andhra Pradesh'),
('Noida', 'Uttar Pradesh'),
('Kochi', 'Kerala'),
('Dehradun', 'Uttarakhand'),
('Shimla', 'Himachal Pradesh'),
('Udaipur', 'Rajasthan')
ON CONFLICT DO NOTHING;
