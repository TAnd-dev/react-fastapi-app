"""Changed field count purchase_item_user and favorite_item_user

Revision ID: 2d1ea6ca08b8
Revises: bf867e269adf
Create Date: 2023-10-03 16:31:47.866569

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision: str = '2d1ea6ca08b8'
down_revision: Union[str, None] = 'bf867e269adf'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('card_item_user', 'count',
               existing_type=sa.INTEGER(),
               nullable=False)
    op.alter_column('purchase_item_user', 'count',
               existing_type=sa.INTEGER(),
               nullable=False)
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('purchase_item_user', 'count',
               existing_type=sa.INTEGER(),
               nullable=True)
    op.alter_column('card_item_user', 'count',
               existing_type=sa.INTEGER(),
               nullable=True)
    # ### end Alembic commands ###
