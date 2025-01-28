import classNames from "classnames/bind";
import style from "./AllSearch.module.scss";
import { Row,Col, Container } from "react-bootstrap";

const cx = classNames.bind(style);

function Error() {
    return ( 
        <Container className={cx('pt-5')}>
            <Row>
                <Col>
                    <div className={cx('error')}>
                        Không tìm thấy kết quả
                    </div>
                </Col>
            </Row>
        </Container>
     );
}

export default Error;