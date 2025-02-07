//UsrName: zapatahall1 pasword: tAma...#1055
import React, { useState, useEffect} from 'react';
import './styles.css';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// Import both logo images
import logo from './checkmatewizard_transparent.png'; // Adjust the path as needed
import logoWhite from './checkmatewizard_pure_white.png'; // Adjust the path as needed

const SignupSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/(?=.*[0-9])/, "Password must contain a number.")
    .required('Required'),
});

// Import both logo images


const SignupPage = () => {
    
    const [isLogoHovered, setIsLogoHovered] = useState(false);
    const formik = useFormik({
        initialValues: {
          email: '',
          password: '',
          username: '',
        },
        validationSchema: SignupSchema,
        onSubmit: values => {
          // Here you would usually call the backend to register the user
          console.log(values);
        },
      });
      const [isDropdownOpen, setIsDropdownOpen] = useState(false);
          const [isMobile, setIsMobile] = useState(window.innerWidth < 1200);
          // Event listener for window resize
          useEffect(() => {
                      const handleResize = () => {
                          const isNowMobile = window.innerWidth < 1200;
                          setIsMobile(isNowMobile);
                  
                          if (isNowMobile) {
                              console.log('Applying frozen class');
                              document.body.classList.add('frozen');
                          } else {
                              console.log('Removing frozen class');
                              document.body.classList.remove('frozen');
                          }
                      };
                  
                      window.addEventListener('resize', handleResize);
                  
                      handleResize();
                  
                      return () => window.removeEventListener('resize', handleResize);
                  }, []);
    /*const handleSignup = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/auth/signup', { username, password });
            console.log(response.data); // Handle successful signup response
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.error(error.response.data);
            } else if (error.request) {
                // The request was made but no response was received
                console.error(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.error('Error', error.message);
            }
        }
    };*/
    

    return (
        <div className="signup-page">
            <header>
                 <nav>
                                    <ul>
                                        <li
                                            onMouseEnter={() => setIsLogoHovered(true)}
                                            onMouseLeave={() => setIsLogoHovered(false)}
                                        >
                                            <Link to="/">
                                                <img src={isLogoHovered ? logoWhite : logo} alt="Home" style={{ height: '39px' }} />
                                            </Link>
                                        </li>
                                        {isMobile ? (
                                            <div className="navdropdown-container">
                                                <div
                                                    className={`${isDropdownOpen ? 'navdropdown' : 'navdropdown'}`}
                                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                                >
                                                    <li
                                                        className="navdropdown-header"
                                                        style={{
                                
                                                            lineHeight: '1.78',
                                                            padding: '10px 20px',
                                
                                                            fontSize: '22px',
                                                            color: 'white',
                                                        }}
                                                        
                                                    >
                                                        ☰ Menu
                                                    </li>
                                                    {isDropdownOpen && (
                                                        <ul>
                                                            <li>
                                                                <Link
                                                                    to="/blunder-punisher"
                                                                    className="nav-link"
                                                                    onClick={() => setIsDropdownOpen(false)}
                                                                >
                                                                    Blunder Punisher
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    to="/weakness-finder"
                                                                    className="nav-link"
                                                                    onClick={() => setIsDropdownOpen(false)}
                                                                >
                                                                    Weakness Finder
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    to="/analysis-board"
                                                                    className="nav-link"
                                                                    onClick={() => setIsDropdownOpen(false)}
                                                                >
                                                                    Analysis Board
                                                                </Link>
                                                            </li>
                                                            <li>
                                                                <Link
                                                                    to="/feedback"
                                                                    className="nav-link"
                                                                    onClick={() => setIsDropdownOpen(false)}
                                                                >
                                                                    Your Feedback
                                                                </Link>
                                                            </li>
                                                        </ul>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <ul>
                                                <li>
                                                    <Link to="/blunder-punisher" className="prepare-link">
                                                        Blunder Punisher
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to="/weakness-finder">Weakness Finder</Link>
                                                </li>
                                                <li>
                                                    <Link to="/analysis-board">Analysis Board</Link>
                                                </li>
                                                <li>
                                                    <Link to="/feedback">Your Feedback</Link>
                                                </li>
                                            </ul>
                                        )}
                                    </ul>
                                </nav>
            </header>

            <main>
            <div className='hero'>
                <div className='signup-section'>
            <form onSubmit={formik.handleSubmit}>
      <div>
        <input
          type="text"
          name="username"
          onChange={formik.handleChange}
          value={formik.values.username}
          placeholder="Username"
        />
        {formik.errors.username ? <div className='error-message'>{formik.errors.username}</div> : null}
      </div>
      <div>
        <input
          type="email"
          name="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          placeholder="Email"
        />
        {formik.errors.email ? <div className='error-message'>{formik.errors.email}</div> : null}
      </div>
      <div>
        <input
          type="password"
          name="password"
          onChange={formik.handleChange}
          value={formik.values.password}
          placeholder="Password"
        />
        {formik.errors.password ? <div className='error-message'>{formik.errors.password}</div> : null}
      </div>
      <button className='login-button' type="submit">Sign Up</button>
    </form>
    </div>
    </div>
            </main>

            <footer>
            <p>&copy; 2025 CheckmateWizard.com All rights reserved.</p>
            </footer>
        </div>
    );
};

export default SignupPage;
