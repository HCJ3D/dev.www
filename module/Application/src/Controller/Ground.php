<?php
namespace Application\Controller;

use TypeError;
use LeoGalleguillos\ThreeDimensions\Model\Entity as ThreeDimensionsEntity;
use LeoGalleguillos\ThreeDimensions\Model\Factory as ThreeDimensionsFactory;
use LeoGalleguillos\ThreeDimensions\Model\Service as ThreeDimensionsService;
use LeoGalleguillos\ThreeDimensions\Model\Table as ThreeDimensionsTable;
use LeoGalleguillos\User\Model\Factory as UserFactory;
use Zend\Mvc\Controller\AbstractActionController;
use Zend\View\Model\ViewModel;

class Ground extends AbstractActionController
{
    public function __construct(
        ThreeDimensionsFactory\Ground $groundFactory,
        ThreeDimensionsTable\Ground $groundTable
    ) {
        $this->groundFactory = $groundFactory;
        $this->groundTable   = $groundTable;
    }

    public function getRelevantGroundAction()
    {
        // For now, select all ground. In the future, select relevant ground.
    }
}
