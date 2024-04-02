import Link from 'next/link';
import { Col, Form, Input, Button, Row } from 'antd';
import { ERROR_TEXTS } from '@/utils/error';
import DeleteOutlined from '@ant-design/icons/DeleteOutlined';
import PlusOutlined from '@ant-design/icons/PlusOutlined';

const { TextArea } = Input;

export default function DuckDBProperties() {
  return (
    <>
      <Form.Item
        label="Display name"
        name="displayName"
        rules={[
          {
            required: true,
            message: ERROR_TEXTS.CONNECTION.DISPLAY_NAME.REQUIRED,
          },
        ]}
      >
        <Input placeholder="DuckDB" />
      </Form.Item>
      <Form.Item
        label="Initial SQL statements"
        name="initSql"
        extra="These statements will be executed one time only during initialization."
        rules={[
          {
            required: true,
            message: ERROR_TEXTS.CONNECTION.INIT_SQL.REQUIRED,
          },
        ]}
      >
        <TextArea
          placeholder="CREATE TABLE new_tbl AS SELECT * FROM read_csv('input.csv');"
          rows={4}
        />
      </Form.Item>

      <Form.Item
        label="Configuration options"
        extra={
          <>
            DuckDB has a number of configuration options that can be used to
            change the behavior of the system.{' '}
            <Link
              href="https://duckdb.org/docs/configuration/overview.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </Link>
          </>
        }
      >
        <Form.List name="configurations" initialValue={[{}]}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} wrap={false} gutter={8}>
                  <Col flex="1 0">
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      style={{ width: '100%' }}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              getFieldValue(['configurations', name, 'value'])
                            ) {
                              if (!value) {
                                return Promise.reject(
                                  ERROR_TEXTS.CONNECTION.CONFIGURATION.KEY
                                    .REQUIRED,
                                );
                              }
                            }

                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input placeholder="Key" />
                    </Form.Item>
                  </Col>
                  <Col flex="1 0">
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      style={{ width: '100%' }}
                      rules={[
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (
                              getFieldValue(['configurations', name, 'key'])
                            ) {
                              if (!value) {
                                return Promise.reject(
                                  ERROR_TEXTS.CONNECTION.CONFIGURATION.VALUE
                                    .REQUIRED,
                                );
                              }
                            }

                            return Promise.resolve();
                          },
                        }),
                      ]}
                    >
                      <Input placeholder="Value" />
                    </Form.Item>
                  </Col>
                  <Col flex="none" className="p-1">
                    <DeleteOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item noStyle>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add an option
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
      <Form.Item
        label="Extensions"
        extra={
          <>
            DuckDB has a flexible extension mechanism that allows for
            dynamically loading extensions.{' '}
            <Link
              href="https://duckdb.org/docs/extensions/overview.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn more
            </Link>
          </>
        }
      >
        <Form.List name="extensions" initialValue={['']}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} wrap={false} gutter={8} className="my-2">
                  <Col flex="1 0">
                    <Form.Item
                      {...restField}
                      name={[key]}
                      noStyle
                      style={{ width: '100%' }}
                    >
                      <Input placeholder="Extension name" />
                    </Form.Item>
                  </Col>
                  <Col flex="none" className="p-1">
                    <DeleteOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item noStyle>
                <Button
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Add an Extension
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Form.Item>
    </>
  );
}