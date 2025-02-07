
import '../css/Footer.css'


function Footer() {
    return ( 
        <div>
            <footer style={{backgroundColor : 'black', marginTop: '-16px'}}>
                <div>
                    <hr />
                    <span className="spanClass"><small><u> Copywrite </u> &copy; Veracity IT Solution</small></span>
                    <span style={{marginLeft : '1000px'}}>
                        <i className="fa fa-twitter" alt="Twitter" style={{fontSize : '24px'}}/>
                        <i className="fa fa-instagram" alt="Instagram" style={{padding : '10px',fontSize : '24px'}} />
                        <i className="fa fa-linkedin-square" alt="LinkDin" style={{fontSize : '24px'}}></i> 
                    </span>
                </div>
                    <br />
            </footer>
        </div>
     );
}

export default Footer;