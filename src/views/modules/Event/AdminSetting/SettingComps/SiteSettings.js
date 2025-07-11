import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Button, Card, Col, Form, Modal } from 'react-bootstrap'

const SiteSettings = (props) => {
    const { appName, setLogo, setAuthLogo, setFavicon, setAppName, complimentaryValidation, setComplimentaryValidation, missedCallNumber, setMissedCallNumber, setWaNumber, waNumber, notifyReq, setNotifyReq,setMobileLogo,homeDividerData, setHomeDividerData,agreementData, setAgreementData } = props;

    const [previewUrl, setPreviewUrl] = useState('');
  useEffect(() => {
    if (homeDividerData.home_divider && typeof homeDividerData.home_divider === 'string') {
      setPreviewUrl(homeDividerData.home_divider);
    }
  }, [homeDividerData.home_divider]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setHomeDividerData((prev) => ({
      ...prev,
      home_divider: file,
    }));

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setHomeDividerData((prev) => ({
      ...prev,
      home_divider: null,
    }));
    setPreviewUrl('');
  };

    const [pdfPreviewUrl, setPdfPreviewUrl] = useState('');
  const [signaturePreviewUrl, setSignaturePreviewUrl] = useState('');
  const [showPdfModal, setShowPdfModal] = useState(false);
useEffect(() => {
  if (agreementData?.agreement_pdf) {
    setPdfPreviewUrl(agreementData.agreement_pdf);
  }
  if (agreementData?.e_signature) {
    setSignaturePreviewUrl(agreementData.e_signature);
  }
}, [agreementData]);
  const handlePdfChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const previewUrl = URL.createObjectURL(file);
      setAgreementData(prev => ({ ...prev, agreement_pdf: file }));
      setPdfPreviewUrl(previewUrl);
    }
  };

  const handleSignatureChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setAgreementData(prev => ({ ...prev, e_signature: file }));
      setSignaturePreviewUrl(previewUrl);
    }
  };

  const handleRemovePdf = () => {
    setAgreementData(prev => ({ ...prev, agreement_pdf: '' }));
    setPdfPreviewUrl('');
  };

  const handleRemoveSignature = () => {
    setAgreementData(prev => ({ ...prev, e_signature: '' }));
    setSignaturePreviewUrl('');
  };
    return (
      <>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Logo</Form.Label>
            <Form.Control
              accept="image/*"
              type="file"
              id="logoFile"
              onChange={(e) => setLogo(e.target.files[0])}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Auth Logo</Form.Label>
            <Form.Control
              accept="image/*"
              type="file"
              id="logoFile"
              onChange={(e) => setMobileLogo(e.target.files[0])}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Mobile Logo</Form.Label>
            <Form.Control
              accept="image/*"
              type="file"
              id="logoFile"
              onChange={(e) => setAuthLogo(e.target.files[0])}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Favicon</Form.Label>
            <Form.Control
              type="file"
              id="faviconFile"
              onChange={(e) => setFavicon(e.target.files[0])}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>App Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="App name"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>WhatsApp Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="WhatsApp Number"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col lg="4">
          <Form.Group className="mb-3 form-group">
            <Form.Label>Missed Call Number</Form.Label>
            <Form.Control
              type="number"
              placeholder="Missed Call Number"
              value={missedCallNumber}
              onChange={(e) => setMissedCallNumber(e.target.value)}
            />
          </Form.Group>
        </Col>
        {/* make col for switch */}
        <Col lg="3" className="d-flex align-items-center">
          <Form.Group className="mb-0 form-group">
            <Form.Label>{"User Notification Permission"}</Form.Label>
            <Form.Check type="switch">
              <Form.Check.Input
                checked={notifyReq}
                onChange={(e) => setNotifyReq(e.target.checked)}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Check>
          </Form.Group>
        </Col>
        <Col lg="3" className="d-flex align-items-center">
          <Form.Group className="mb-0 form-group">
            <Form.Label>{"Complimentary User Validation"}</Form.Label>
            <Form.Check type="switch">
              <Form.Check.Input
                checked={complimentaryValidation}
                onChange={(e) => setComplimentaryValidation(e.target.checked)}
              />
              <Form.Control.Feedback tooltip>Looks good!</Form.Control.Feedback>
            </Form.Check>
          </Form.Group>
        </Col>
        <Col lg="4" className="mb-3">
          <Form.Group>
            <Form.Label>Home Divider Image</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          {previewUrl && (
            <Card className="mt-2 position-relative">
              <Button
                variant="danger"
                size="sm"
                onClick={handleRemoveImage}
                className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
                style={{ zIndex: 1 }}
              >
                <X size={16} />
              </Button>
              <Card.Img
                src={previewUrl}
                style={{ height: "150px", objectFit: "contain" }}
                alt="Preview"
              />
            </Card>
          )}
        </Col>

        <Col lg="4" className="mb-3">
          <Form.Group>
            <Form.Label>Home Divider External URL</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter external image URL"
              value={homeDividerData.home_divider_url}
              onChange={(e) =>
                setHomeDividerData((prev) => ({
                  ...prev,
                  home_divider_url: e.target.value,
                }))
              }
            />
          </Form.Group>
        </Col>
        <Col lg="2" className="mb-3 d-flex align-items-end">
  <Form.Check
    type="checkbox"
    label="External Link"
    checked={homeDividerData.external_link}
    onChange={(e) =>
      setHomeDividerData((prev) => ({
        ...prev,
        external_link: e.target.checked,
      }))
    }
  />
</Col>

<Col lg="2" className="mb-3 d-flex align-items-end">
  <Form.Check
    type="checkbox"
    label="Open in New Tab"
    checked={homeDividerData.new_tab}
    onChange={(e) =>
      setHomeDividerData((prev) => ({
        ...prev,
        new_tab: e.target.checked,
      }))
    }
  />
</Col>


<Col lg="6" className="mb-3">
        <Form.Group>
          <Form.Label>Agreement PDF</Form.Label>
          <Form.Control type="file" accept="application/pdf" onChange={handlePdfChange} />
        </Form.Group>

        {agreementData?.agreement_pdf && pdfPreviewUrl && (
          <Card className="mt-2 position-relative">
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemovePdf}
              className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
              style={{ zIndex: 1 }}
            >
              <X size={16} />
            </Button>
            <Card.Body
              className="text-center"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowPdfModal(true)}
            >
              <p className="mb-0 text-primary">Click to Preview PDF</p>
            </Card.Body>
          </Card>
        )}
      </Col>

      <Col lg="6" className="mb-3">
        <Form.Group>
          <Form.Label>E-Signature Image</Form.Label>
          <Form.Control type="file" accept="image/*" onChange={handleSignatureChange} />
        </Form.Group>

        {agreementData?.e_signature && signaturePreviewUrl && (
          <Card className="mt-2 position-relative">
            <Button
              variant="danger"
              size="sm"
              onClick={handleRemoveSignature}
              className="position-absolute top-0 end-0 m-1 rounded-circle p-1"
              style={{ zIndex: 1 }}
            >
              <X size={16} />
            </Button>
            <Card.Img
              src={signaturePreviewUrl}
              alt="E-Signature"
              style={{ height: '150px', objectFit: 'contain' }}
            />
          </Card>
        )}
      </Col>

      {/* PDF Modal */}
      <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agreement PDF Preview</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ height: '80vh' }}>
          {pdfPreviewUrl && (
            <iframe
              src={pdfPreviewUrl}
              title="Agreement Preview"
              width="100%"
              height="100%"
              style={{ border: 'none' }}
            />
          )}
        </Modal.Body>
      </Modal>
      </>
    );
}

export default SiteSettings
