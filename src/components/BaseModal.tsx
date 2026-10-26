import { Modal, Text } from "react-native";

interface BaseModalProps {
  visible: boolean;
}

const BaseModal = ({ visible }: BaseModalProps) => {
  <Modal visible={visible}>
    <Text>This is a text</Text>
  </Modal>;
};

export default BaseModal;
