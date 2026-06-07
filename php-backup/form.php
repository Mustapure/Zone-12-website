<?php
// Start output buffering to prevent "headers already sent" issues
ob_start();

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'jci_zone12');
define('DB_USER', 'root');
define('DB_PASS', '');
define('CSRF_SECRET', 'jci_zone12_secret_key_2024');

$message = '';
$messageType = '';

// Function to get database connection
function getDB() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    $conn->select_db(DB_NAME);
    return $conn;
}

// Generate CSRF token (using hash-based approach without session)
function generateCSRFToken() {
    $token = bin2hex(random_bytes(32));
    $hash = hash_hmac('sha256', $token, CSRF_SECRET);
    return $token . ':' . $hash;
}

// Validate CSRF token
function validateCSRFToken($token) {
    if (!isset($token) || strpos($token, ':') === false) {
        return false;
    }
    $parts = explode(':', $token);
    if (count($parts) !== 2) {
        return false;
    }
    $expectedHash = hash_hmac('sha256', $parts[0], CSRF_SECRET);
    return hash_equals($parts[1], $expectedHash);
}

// Sanitize input
function sanitizeInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
    return $data;
}

// Validate email
function validateEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL);
}

// Validate phone
function validatePhone($phone) {
    return preg_match('/^[0-9+\-\s()]{7,20}$/', $phone);
}

// Handle form submission
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        // Validate CSRF token
        if (!isset($_POST['csrf_token']) || !validateCSRFToken($_POST['csrf_token'])) {
            throw new Exception('Invalid request. Please try again.');
        }

        // Get and sanitize input
        $name = sanitizeInput($_POST['name'] ?? '');
        $email = sanitizeInput($_POST['email'] ?? '');
        $phone = sanitizeInput($_POST['phone'] ?? '');
        $city = sanitizeInput($_POST['city'] ?? '');
        $messageText = sanitizeInput($_POST['message'] ?? '');

        // Validation
        $errors = [];
        
        if (empty($name)) {
            $errors[] = 'Name is required.';
        } elseif (strlen($name) > 100) {
            $errors[] = 'Name must be less than 100 characters.';
        }

        if (empty($email)) {
            $errors[] = 'Email is required.';
        } elseif (!validateEmail($email)) {
            $errors[] = 'Please enter a valid email address.';
        }

        if (!empty($phone) && !validatePhone($phone)) {
            $errors[] = 'Please enter a valid phone number.';
        }

        if (empty($errors)) {
            // Insert into database
            $conn = getDB();
            $stmt = $conn->prepare("INSERT INTO contact_submissions (name, email, phone, city, message) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("sssss", $name, $email, $phone, $city, $messageText);
            
            if ($stmt->execute()) {
                $message = 'Thank you for joining JCI! We will contact you soon.';
                $messageType = 'success';
                
                // Clear form data after successful submission
                $_POST = [];
            } else {
                throw new Exception('Failed to submit form. Please try again.');
            }
            
            $stmt->close();
            $conn->close();
        } else {
            $message = implode('<br>', $errors);
            $messageType = 'error';
        }
    } catch (Exception $e) {
        $message = $e->getMessage();
        $messageType = 'error';
    }
    
    // Regenerate CSRF token after form submission
    generateCSRFToken();
}

// Generate CSRF token for the form
$csrfToken = generateCSRFToken();
?>

<!DOCTYPE html>
<html>
<head>
<title>Contact Section</title>
<style>
/* Join JCI Section */
#join-jci {
    margin: 50px 0;
    padding: 0 20px;
}

.join-jci-container {
    display: flex;
    max-width: 1100px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

/* Left Column: Image */
.join-jci-image {
    flex: 1;
    position: relative;
    min-height: 450px;
}

.join-jci-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.image-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 40px 30px;
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.85));
    color: white;
}

/* Right Column: Form */
.join-jci-form {
    flex: 1.2;
    padding: 50px;
}

.join-jci-form h2 {
    color: var(--jci-blue);
    margin-bottom: 10px;
}

.join-jci-form form {
    display: flex;
    flex-direction: column;
    gap: 15px;
    margin-top: 25px;
}

.form-row {
    display: flex;
    gap: 15px;
}

.join-jci-form input, 
.join-jci-form textarea {
    width: 100%;
    padding: 12px 15px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-family: inherit;
}

.join-jci-form input:focus,
.join-jci-form textarea:focus {
    outline: none;
    border-color: var(--jci-blue);
    box-shadow: 0 0 0 3px rgba(0, 119, 170, 0.1);
}

.join-jci-form textarea {
    min-height: 100px;
    resize: vertical;
}

.join-jci-form button {
    padding: 15px;
    background-color: var(--jci-blue);
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: bold;
    cursor: pointer;
    transition: 0.3s;
}

.join-jci-form button:hover {
    background-color: #0077aa;
}

/* Alert Messages */
.alert {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
}

.alert-success {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.alert-error {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

/* Mobile Responsiveness */
@media (max-width: 900px) {
    .join-jci-container {
        flex-direction: column;
    }
    .join-jci-image {
        min-height: 250px;
    }
    .form-row {
        flex-direction: column;
    }
}
</style>
</head>

<body>

<div class="container">
<div class="row">

<!-- Right Form -->
<section id="join-jci">
    <div class="join-jci-container">
        <div class="join-jci-image">
            <img src="join.jpg" alt="JCI Zone 12">
            <div class="image-overlay">
                <h3>Join the Movement</h3>
                <p>Become part of a global network of young leaders creating positive change in communities worldwide.</p>
            </div>
        </div>

        <div class="join-jci-form">
            <h2>Be a Part of JCI</h2>
            <p>Join a global movement of young leaders creating positive change.</p>

            <?php if (!empty($message)): ?>
                <div class="alert alert-<?php echo $messageType; ?>">
                    <?php echo $message; ?>
                </div>
            <?php endif; ?>

            <form action="form.php" method="post">
                <input type="hidden" name="csrf_token" value="<?php echo $csrfToken; ?>">
                
                <input type="text" 
                       name="name" 
                       placeholder="Full Name" 
                       value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>" 
                       required>
                
                <div class="form-row">
                    <input type="email" 
                           name="email" 
                           placeholder="Email Address" 
                           value="<?php echo isset($_POST['email']) ? htmlspecialchars($_POST['email']) : ''; ?>" 
                           required>
                    
                    <input type="tel" 
                           name="phone" 
                           placeholder="Phone Number" 
                           value="<?php echo isset($_POST['phone']) ? htmlspecialchars($_POST['phone']) : ''; ?>" 
                           required>
                </div>
                
                <input type="text" 
                       name="city" 
                       placeholder="Location" 
                       value="<?php echo isset($_POST['city']) ? htmlspecialchars($_POST['city']) : ''; ?>" 
                       required>
                
                <textarea name="message" 
                          placeholder="Why do you want to join JCI?"><?php echo isset($_POST['message']) ? htmlspecialchars($_POST['message']) : ''; ?></textarea>
                
                <button type="submit">🔵 Join JCI</button>
            </form>
        </div>
    </div>
</section>

</body>
</html>

