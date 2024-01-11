import { Text } from "@/components/common/Text";
import Button from "@/components/common/Button";
import Modal from "@/components/modal/Modal";
import React from "react";

interface Props {
	close: () => void
}

export function ItemCreateModal(props: Props) {
	return (
		<Modal
			title={'Add item'}
			closeButtonText={'Cancel'}
			footer={(
				<Button
					text={'Add item'}
					onPress={() => { }}
				/>
			)}
			close={props.close}
		>
			<Text variant={'title'}>TODO</Text>
		</Modal>
	)
}
