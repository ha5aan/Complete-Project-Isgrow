import { Card, Button, Modal, Form, FloatingLabel } from 'react-bootstrap';
import './App.css';
import { useEffect, useState } from 'react'

function App() {
  const [ProductsList, setProductsList] = useState()
  const [ShowList, setShowList] = useState(false)
  const [show, setShow] = useState(false);
  const [currentProduct, setCurrentProduct] = useState()
  const [rating, setRating] = useState()
  const [review, setReview] = useState("")
  const [currentReview,setCurrentReview]=useState("")
  const[showReview,setShowReview]=useState(false)
  const[APIresponse,setAPIresponse]=useState()
  const handleClose = () => setShow(false);
  const handleShow = (current) => {
    setShow(true)
    setCurrentProduct(current)
  };

  useEffect(() => {
    getdata()
  }, [])

  async function getdata() {
    await fetch("http://localhost:2000/getProducts")
      .then(response => {
        console.log(response);
        return response.json();
      }).then(json => setProductsList(json))
      .catch(err => {
        console.error(err);
      });

    console.log(typeof (ProductsList))
    setShowList(true)


  }



  const SendDataToDB = (e) => {
    e.preventDefault();
    console.log("Data")
    let ratingnumber=document.querySelector('input[name="group1"]:checked').value;
    console.log( "Current Product is" + currentProduct.toString())
    console.log("Current Rating is "+document.querySelector('input[name="group1"]:checked').value);
    console.log("current Review is " + currentReview)
    let APIObject={
      "productRefID":currentProduct,
      "review":currentReview,
      "rating":ratingnumber
    }
    console.log(APIObject)
    fetch('http://localhost:2000/review', {
      method: 'POST',
      body: JSON.stringify(APIObject),
      headers: { 'Content-Type': 'application/json' },
    })
      .then(res => res.json())
      .then(json => setAPIresponse(json))



    handleClose()

  }
  return (
    <div >


      {ShowList && ProductsList.map((itemmm, index) => {
        return (
          <div className='Cards'>
            <Card style={{ width: '18rem' }}>
              <Card.Img variant="top" src={itemmm.thumbnail} />
              <Card.Body>
                <Card.Title>{itemmm.title}</Card.Title>
                <Card.Text>
                  Price: {itemmm.currency} {itemmm.price}<br />
                  Product ID : {itemmm.productID}
                </Card.Text>
                <Button variant="primary" onClick={() => { handleShow(itemmm.productID); setReview(itemmm.review); setRating(itemmm.rating) ; setShowReview(true) }}>
                  Give Review 
                </Button>
                <Modal show={show} onHide={handleClose}>
                  <Modal.Header closeButton>
                    <Modal.Title>Please Give Review </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form onSubmit={(e) => SendDataToDB(e)}>
                      <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                        <Form.Label> Product Id:</Form.Label>
                        <Form.Control type="text" placeholder={currentProduct} value={currentProduct} disabled />
                      </Form.Group>

                      {['radio'].map((type) => (
                        <div key={`inline-${type}`} className="mb-3">
                          <Form.Check
                            inline
                            label="1"
                            name="group1"
                            type={type}
                            value="1"
                            id={`inline-${type}-1`}
                            required
                          />
                          <Form.Check
                            inline
                            label="2"
                            name="group1"
                            type={type}
                            value="2"
                            id={`inline-${type}-2`}
                            required
                          />
                          <Form.Check
                            inline
                            label="3"
                            name="group1"
                            type={type}
                            value="3"
                            id={`inline-${type}-2`}
                            required
                          />
                          <Form.Check
                            inline
                            label="4"
                            name="group1"
                            type={type}
                            value="4"
                            id={`inline-${type}-2`}
                            required
                          />
                          <Form.Check
                            inline
                            label="5"
                            name="group1"
                            value="5"
                            type={type}
                            id={`inline-${type}-2`}
                            required

                          />


                          <FloatingLabel controlId="floatingTextarea2" label="Comments">
                            <Form.Control onChange={(e) => { setCurrentReview(e.target.value) }}
                              as="textarea"
                              placeholder="Leave a comment here"
                              style={{ height: '100px' }}
                            />
                          </FloatingLabel>
                        </div>
                      ))}
                       Previous Reviews
                    <ul>
                      {showReview &&review.map((currentReview,index)=>{
                        return<li key={index}>{currentReview}</li>
                    })}
                    </ul>
                    <br/>
                    Previous Rating : {rating} <br/>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
                      <Button variant="primary" type="submit">
                        Submit
                      </Button>
                      </Modal.Footer>
                    </Form>
                   
                    </Modal.Body>
                
                </Modal>
              </Card.Body>
            </Card>
          </div>
        )
      })}



    </div>
  );
}

export default App;
