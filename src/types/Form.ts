import { StringListArrayWidgetConfiguration } from '../widgets/StringListArrayWidget'
import { StringListWidgetConfiguration } from '../widgets/StringListWidget'
import { StringChoiceWidgetConfiguration } from '../widgets/StringChoiceWidget'
import { GeographicExtentWidgetConfiguration } from '../widgets/GeographicExtentWidget'
import { TextWidgetConfiguration } from '../widgets/TextWidget'
import { LicenceWidgetConfiguration } from '../widgets/LicenceWidget'
import { ExclusiveGroupWidgetConfiguration } from '../widgets/ExclusiveGroupWidget'
import { FreeformInputWidgetConfiguration } from '../widgets/FreeformInputWidget'
import { DateRangeWidgetConfiguration } from '../widgets/DateRangeWidget'
import { GeographicLocationWidgetConfiguration } from '../widgets/GeographicLocationWidget'

export type FormConfiguration =
  | ExclusiveGroupWidgetConfiguration
  | StringListArrayWidgetConfiguration
  | StringListWidgetConfiguration
  | StringChoiceWidgetConfiguration
  | GeographicExtentWidgetConfiguration
  | TextWidgetConfiguration
  | LicenceWidgetConfiguration
  | FreeformInputWidgetConfiguration
  | DateRangeWidgetConfiguration
  | GeographicLocationWidgetConfiguration
