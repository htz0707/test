import {
  Card,
  Form,
  InputNumber,
  Select,
  Button,
  Typography,
  notification,
} from "antd";
import { SwapOutlined } from "@ant-design/icons";
import { useEffect, useMemo } from "react";
import { usePrices } from "../../hooks/usePrices";
import TokenOption from "../TokenOption";

const { Text } = Typography;

export default function SwapForm() {
  const [form] = Form.useForm();
  const prices = usePrices();
  const tokens = Object.keys(prices);

  useEffect(() => {
    if (!tokens.length) return;

    const from = form.getFieldValue("from");
    const to = form.getFieldValue("to");

    if (!from || !to) {
      form.setFieldsValue({
        from: tokens[0],
        to: tokens[1] ?? tokens[0],
      });
    }
  }, [tokens, form]);

  const amount = Form.useWatch("amount", form);
  const from = Form.useWatch("from", form);
  const to = Form.useWatch("to", form);

  const output = useMemo(() => {
    if (!amount || !from || !to) return 0;
    return (amount * prices[from]) / prices[to];
  }, [amount, from, to, prices]);

  const canSubmit =
    amount && amount > 0 && from && to && from !== to;

  return (
    <Card title="Swap" style={{ width: 380 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => {
          const from = form.getFieldValue("from");
          const to = form.getFieldValue("to");

          notification.success({
            message: "Swap successful",
            description: (
              <>
                <div>
                  Sent: <b>{values.amount} {from}</b>
                </div>
                <div>
                  Received: <b>{output.toFixed(6)} {to}</b>
                </div>
              </>
            ),
            placement: "topRight",
            duration: 3,
          });

          form.resetFields(["amount"]);
        }}
      >
        <Form.Item
          label="Amount to send"
          name="amount"
          rules={[
            {
              validator(_, value) {
                if (value == null) {
                  return Promise.reject(
                    new Error("Please enter amount")
                  );
                }
                if (value <= 0) {
                  return Promise.reject(
                    new Error("Amount must be greater than 0")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            addonBefore={
              <Form.Item
                name="from"
                noStyle
                rules={[{ required: true }]}
              >
                <Select style={{ width: 120 }}>
                  {tokens.map((t) => (
                    <Select.Option key={t} value={t}>
                      <TokenOption symbol={t} />
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            }
          />
        </Form.Item>

        <Button
          icon={<SwapOutlined />}
          style={{ display: "block", margin: "12px auto" }}
          onClick={() => {
            const f = form.getFieldValue("from");
            const t = form.getFieldValue("to");
            if (!f || !t) return;
            form.setFieldsValue({ from: t, to: f });
          }}
        />

        <Form.Item label="Amount to receive">
          <InputNumber
            style={{ width: "100%" }}
            value={Number(output.toFixed(6))}
            disabled
            addonBefore={
              <Form.Item
                name="to"
                noStyle
                dependencies={["from"]}
                rules={[
                  { required: true },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (value === getFieldValue("from")) {
                        return Promise.reject(
                          new Error("Tokens must be different")
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <Select style={{ width: 120 }}>
                  {tokens.map((t) => (
                    <Select.Option key={t} value={t}>
                      <TokenOption symbol={t} />
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            }
          />
        </Form.Item>

        <Text type="secondary">
          {from && to
            ? `Rate: 1 ${from} ≈ ${(prices[from] / prices[to]).toFixed(6)} ${to}`
            : "Rate: -"}
        </Text>

        <Button
          type="primary"
          htmlType="submit"
          block
          disabled={!canSubmit}
          style={{ marginTop: 16 }}
        >
          CONFIRM SWAP
        </Button>
      </Form>
    </Card>
  );
}
