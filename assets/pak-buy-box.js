import { Component } from '@theme/component';
import { formatMoney } from '@theme/money-formatting';

const DAYS_SUPPLY_PER_TUB = 30;

class PakBuyBoxComponent extends Component {
  requiredRefs = ['tierInputs', 'purchaseInputs', 'unitPriceText', 'perDayText', 'totalText', 'discountLine'];

  connectedCallback() {
    super.connectedCallback();
    this.updatePriceSummary();
  }

  updatePriceSummary() {
    const tierInput = this.refs.tierInputs.find((input) => input.checked);
    const purchaseInput = this.refs.purchaseInputs.find((input) => input.checked);
    if (!tierInput || !purchaseInput) return;

    const isSubscribe = purchaseInput.value === 'subscribe';
    const quantity = Number(tierInput.dataset.quantity) || 1;
    const unitCents = Number(
      isSubscribe ? tierInput.dataset.priceSubscribeCents : tierInput.dataset.priceOnetimeCents
    ) || 0;
    const oneTimeCents = Number(tierInput.dataset.priceOnetimeCents) || 0;
    const totalCents = unitCents * quantity;
    const perDayCents = Math.round(totalCents / (quantity * DAYS_SUPPLY_PER_TUB));
    const discountPercent = isSubscribe && oneTimeCents > unitCents
      ? Math.round((1 - unitCents / oneTimeCents) * 100)
      : 0;

    const { moneyFormat, currency } = this.dataset;

    this.refs.unitPriceText.textContent = formatMoney(unitCents, moneyFormat, currency);
    this.refs.perDayText.textContent = formatMoney(perDayCents, moneyFormat, currency);
    this.refs.totalText.textContent = formatMoney(totalCents, moneyFormat, currency);

    if (discountPercent > 0) {
      this.refs.discountLine.textContent = `You're Getting ${discountPercent}% Off`;
      this.refs.discountLine.hidden = false;
    } else {
      this.refs.discountLine.hidden = true;
    }

    if (this.refs.freeGiftsLine) this.refs.freeGiftsLine.hidden = !isSubscribe;
    if (this.refs.freeGiftsImages) this.refs.freeGiftsImages.hidden = !isSubscribe;
  }
}

if (!customElements.get('pak-buy-box-component')) {
  customElements.define('pak-buy-box-component', PakBuyBoxComponent);
}
